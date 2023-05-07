/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import * as ts from 'typescript';

const mapper = new WeakMap();

function hash(name: string): string {
	const nameParts = name.split(/(?=[A-Z])/);
	return nameParts
		.map(p => p[0])
		.join('')
		.toLowerCase();
}

function generateName(originalName: string, program: ts.Program): string {
	if (!mapper.has(program)) {
		mapper.set(program, new Map());
	}

	const map = mapper.get(program);
	if (!map.has(originalName)) {
		map.set(originalName, hash(originalName));
	}

	return map.get(originalName);
}

export type MangleTransformerOptions = {};

export const mangleMembers = function mangleMembers(
	program: ts.Program,
	options: MangleTransformerOptions = {}
) {
	return (ctx: ts.TransformationContext): ts.Transformer<any> => {
		const visitor = (node: ts.Node): ts.Node => {
			if (isAccessExpression(node)) {
				return createAccessExpression(node, program, options);
			}

			if (ts.isBindingElement(node)) {
				return createBindingElement(node, program, options);
			}

			if (isConstructorParameterReference(node, program, options)) {
				return createNode(program, node, ts.factory.createIdentifier);
			}

			return ts.visitEachChild(node, visitor, ctx);
		};

		return (file: ts.SourceFile): ts.Node =>
			ts.visitEachChild(file, visitor, ctx);
	};
};

function isAccessExpression(node: ts.Node): node is ts.AccessExpression {
	return (
		ts.isPropertyAccessExpression(node) ||
		ts.isElementAccessExpression(node)
	);
}

function createAccessExpression(
	node: ts.AccessExpression,
	program: ts.Program,
	options: MangleTransformerOptions
): ts.Node {
	const typeChecker = program.getTypeChecker();

	const accessName = ts.isPropertyAccessExpression(node)
		? node.name
		: node.argumentExpression;
	const symbol = typeChecker.getSymbolAtLocation(accessName);

	if (!isPrivate(symbol, options)) {
		return node;
	}

	let propName;
	let creator;

	if (ts.isPropertyAccessExpression(node)) {
		propName = node.name;
		creator = (newName: string): ts.PropertyAccessExpression =>
			ts.factory.updatePropertyAccessExpression(
				node,
				node.expression,
				ts.factory.createIdentifier(newName)
			);
	} else {
		if (!ts.isStringLiteral(node.argumentExpression)) {
			return node;
		}

		propName = node.argumentExpression;
		creator = (newName: string): ts.ElementAccessExpression =>
			ts.factory.createElementAccessExpression(
				node.expression,
				ts.factory.createStringLiteral(newName)
			);
	}

	return createNode(program, propName, creator);
}

function createBindingElement(
	node: ts.BindingElement,
	program: ts.Program,
	options: MangleTransformerOptions
): ts.Node {
	const typeChecker = program.getTypeChecker();

	let propName;
	let symbol;

	if (node.propertyName === undefined) {
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

	if (!isPrivate(symbol, options)) {
		return node;
	}

	return createNode(program, propName, (newName: string) =>
		ts.factory.createBindingElement(
			node.dotDotDotToken,
			newName,
			node.name,
			node.initializer
		)
	);
}

function createNode(
	program: ts.Program,
	oldProperty: ts.Node,
	createNode: (newName: string) => ts.Node
): ts.Node {
	return createNode(generateName(oldProperty.getText(), program));
}

function isPrivate(
	symbol: ts.Symbol | undefined,
	options: MangleTransformerOptions
): boolean {
	if (symbol === undefined || symbol.declarations === undefined) {
		return false;
	}

	if (symbol.name.startsWith('__impl')) {
		return true;
	}

	return symbol.declarations.some(x => {
		return (
			((isClassMember(x) && !hasDecorators(x)) ||
				isConstructorParameter(x)) &&
			isPrivateNonStatic(x)
		);
	});
}

function isClassMember(
	node: ts.Node
): node is ts.MethodDeclaration | ts.PropertyDeclaration {
	return ts.isMethodDeclaration(node) || ts.isPropertyDeclaration(node);
}

function isConstructorParameter(
	node: ts.Node
): node is ts.ConstructorDeclaration {
	return ts.isParameter(node) && ts.isConstructorDeclaration(node.parent);
}

function isConstructorParameterReference(
	node: ts.Node,
	program: ts.Program,
	options: MangleTransformerOptions
): boolean {
	if (!ts.isIdentifier(node)) {
		return false;
	}

	const typeChecker = program.getTypeChecker();
	const symbol = typeChecker.getSymbolAtLocation(node);
	return isPrivate(symbol, options);
}

function isPrivateNonStatic(node: ts.Node): boolean {
	return (
		hasPrivateKeyword(node) &&
		!hasModifier(node, ts.SyntaxKind.StaticKeyword)
	);
}

function hasPrivateKeyword(node: ts.Node): boolean {
	return hasModifier(node, ts.SyntaxKind.PrivateKeyword);
}

function hasModifier(node: ts.Node, modifier: ts.SyntaxKind): boolean {
	return Boolean(getModifiers(node)?.some(mod => mod.kind === modifier));
}

function hasDecorators(node: ts.Node): boolean {
	return ts.canHaveDecorators(node) && Boolean(ts.getDecorators(node));
}

function getModifiers(node: ts.Node): readonly ts.Modifier[] | undefined {
	return ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
}
