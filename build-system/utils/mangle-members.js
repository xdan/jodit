/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const ts = require('typescript');

module.exports.mangleMembers = function (program) {
	return ctx => {
		const visitor = node => {
			if (isAccessExpression(node)) {
				return createNewAccessExpression(node, program);
			}

			if (ts.isBindingElement(node)) {
				return createNewBindingElement(node, program);
			}

			if (isConstructorParameterReference(node, program)) {
				return createNewNode(program, node, ts.createIdentifier);
			}

			return node;
		};

		const visitNodeAndChildren = node => {
			return ts.visitEachChild(visitor(node), visitNodeAndChildren, ctx);
		};

		return file => visitNodeAndChildren(file);
	};
};

function isAccessExpression(node) {
	return (
		ts.isPropertyAccessExpression(node) ||
		ts.isElementAccessExpression(node)
	);
}

function createNewAccessExpression(node, program) {
	const typeChecker = program.getTypeChecker();

	const accessName = ts.isPropertyAccessExpression(node)
		? node.name
		: node.argumentExpression;
	const symbol = typeChecker.getSymbolAtLocation(accessName);

	if (!isPrivateNonStaticClassMember(symbol)) {
		return node;
	}

	let propName;
	let creator;

	if (ts.isPropertyAccessExpression(node)) {
		propName = node.name;
		creator = newName => {
			return ts.createPropertyAccess(node.expression, newName);
		};
	} else {
		if (!ts.isStringLiteral(node.argumentExpression)) {
			return node;
		}

		propName = node.argumentExpression;
		creator = newName => {
			return ts.createElementAccess(
				node.expression,
				ts.createStringLiteral(newName)
			);
		};
	}

	return createNewNode(program, propName, creator);
}

function createNewBindingElement(node, program) {
	const typeChecker = program.getTypeChecker();

	let propName;
	let symbol;

	if (node.propertyName === undefined) {
		// if no property name is set (const { a } = foo)
		// then node.propertyName is undefined and we need to find this property by yourself
		// so let's use go-to-definition algorithm from TSServer
		// see https://github.com/microsoft/TypeScript/blob/672b0e3e16ad18b422dbe0cec5a98fce49881b76/src/services/goToDefinition.ts#L58-L77
		if (!ts.isObjectBindingPattern(node.parent)) {
			return node;
		}

		const type = typeChecker.getTypeAtLocation(node.parent);
		if (type.isUnion()) {
			return node;
		}

		if (!ts.isIdentifier(node.name)) {
			return node;
		}

		propName = node.name;
		symbol = type.getProperty(ts.idText(propName));
	} else {
		propName = node.propertyName;
		symbol = typeChecker.getSymbolAtLocation(node.propertyName);
	}

	if (!isPrivateNonStaticClassMember(symbol)) {
		return node;
	}

	return createNewNode(program, propName, newName => {
		return ts.createBindingElement(
			node.dotDotDotToken,
			newName,
			node.name,
			node.initializer
		);
	});
}

function createNewNode(program, oldProperty, createNode) {
	const typeChecker = program.getTypeChecker();
	const symbol = typeChecker.getSymbolAtLocation(oldProperty);
	if (symbol === undefined) {
		throw new Error(
			`Cannot get symbol for node "${oldProperty.getText()}"`
		);
	}

	const oldPropertyName = symbol.escapedName;

	const newPropertyName = getNewName(oldPropertyName, program);
	return createNode(newPropertyName);
}

const mapper = new WeakMap();
const counter = Symbol('Counter');

function getNewName(originalName, program) {
	if (!mapper.has(program)) {
		mapper.set(program, new Map());
	}

	const map = mapper.get(program);
	if (!map.has(originalName)) {
		let count = map.get(counter) ?? 9;
		count++;
		map.set(counter, count);
		map.set(originalName, '_' + count.toString(16));
	}

	console.log(`Mangle ${originalName} to ${map.get(originalName)}`);
	return map.get(originalName);
}

function isPrivateNonStaticClassMember(symbol) {
	// for some reason ts.Symbol.declarations can be undefined (for example in order to accessing to proto member)
	if (symbol === undefined || symbol.declarations === undefined) {
		// tslint:disable-line:strict-type-predicates
		return false;
	}

	return symbol.declarations.some(x => {
		// terser / uglify property minifiers aren't able to handle decorators
		return (
			((isClassMember(x) && !hasDecorators(x)) ||
				isConstructorParameter(x)) &&
			isPrivateNonStatic(x)
		);
	});
}

function isClassMember(node) {
	return ts.isMethodDeclaration(node) || ts.isPropertyDeclaration(node);
}

function isConstructorParameter(node) {
	return ts.isParameter(node) && ts.isConstructorDeclaration(node.parent);
}

function isConstructorParameterReference(node, program) {
	if (!ts.isIdentifier(node)) {
		return false;
	}

	const typeChecker = program.getTypeChecker();
	const symbol = typeChecker.getSymbolAtLocation(node);
	return isPrivateNonStaticClassMember(symbol);
}

function isPrivateNonStatic(node) {
	return (
		hasPrivateKeyword(node) &&
		!hasModifier(node, ts.SyntaxKind.StaticKeyword)
	);
}

function hasPrivateKeyword(node) {
	return hasModifier(node, ts.SyntaxKind.PrivateKeyword);
}

function hasModifier(node, modifier) {
	const modifiers = getModifiers(node);
	return (
		modifiers !== undefined && modifiers.some(mod => mod.kind === modifier)
	);
}

function hasDecorators(node) {
	return ts.canHaveDecorators(node) && Boolean(ts.getDecorators(node));
}

function getModifiers(node) {
	return ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
}
