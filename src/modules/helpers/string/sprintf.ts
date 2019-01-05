/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

export const sprintf = (...args: Array<string | number>): string => {
    let i: number = 0;

    const regex: RegExp = /%%|%(\d+\$)?([-+#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g,
        a: Array<string | number> = args,
        format: string = a[i++] as string;

    const pad = (
        str: string,
        len: number,
        chr: string,
        leftJustify: boolean
    ): string => {
        const padding =
            str.length >= len
                ? ''
                : Array((1 + len - str.length) >>> 0).join(chr);
        return leftJustify ? str + padding : padding + str;
    };

    // justify()
    const justify = (
        value: string,
        prefix: string,
        leftJustify: boolean,
        minWidth: number,
        zeroPad: boolean
    ): string => {
        const diff: number = minWidth - value.length;

        if (diff > 0) {
            if (leftJustify || !zeroPad) {
                value = pad(value, minWidth, ' ', leftJustify);
            } else {
                value =
                    value.slice(0, prefix.length) +
                    pad('', diff, '0', true) +
                    value.slice(prefix.length);
            }
        }

        return value;
    };

    const formatBaseX = (
        value: any,
        base: any,
        prefix: any,
        leftJustify: any,
        minWidth: number,
        precision: number,
        zeroPad: boolean
    ) => {
        const number = value >>> 0;
        prefix =
            (prefix &&
                number &&
                ({ 2: '0b', 8: '0', 16: '0x' } as any)[base]) ||
            '';
        const newValue: string =
            prefix + pad(number.toString(base), precision || 0, '0', false);

        return justify(newValue, prefix, leftJustify, minWidth, zeroPad);
    };

    const formatString = (
        value: string,
        leftJustify: boolean,
        minWidth: number,
        precision: number,
        zeroPad: any
    ) => {
        if (precision != null) {
            value = value.slice(0, precision);
        }
        return justify(value, '', leftJustify, minWidth, zeroPad);
    };

    const doFormat = (
        substring: string,
        valueIndex: number,
        flags: string,
        minWidth: number | string,
        _: any,
        precision: any | undefined | string | string[],
        type: string
    ) => {
        if (substring === '%%') {
            return '%';
        }

        let leftJustify: boolean = false,
            positivePrefix: string = '',
            zeroPad: boolean = false,
            prefixBaseX: boolean = false;

        for (let j = 0; flags && j < flags.length; j++) {
            switch (flags.charAt(j)) {
                case ' ':
                    positivePrefix = ' ';
                    break;
                case '+':
                    positivePrefix = '+';
                    break;
                case '-':
                    leftJustify = true;
                    break;
                case '0':
                    zeroPad = true;
                    break;
                case '#':
                    prefixBaseX = true;
                    break;
            }
        }

        if (!minWidth) {
            minWidth = 0;
        } else if (minWidth === '*') {
            minWidth = +a[i++];
        } else if (minWidth.toString().charAt(0) === '*') {
            minWidth = +(a as any)[minWidth.toString().slice(1, -1)];
        } else {
            minWidth = +minWidth;
        }

        // Note: undocumented perl feature:
        if (minWidth < 0) {
            minWidth = -minWidth;
            leftJustify = true;
        }

        if (!isFinite(minWidth)) {
            throw new Error('sprintf: (minimum-)width must be finite');
        }

        if (!precision) {
            precision =
                'fFeE'.indexOf(type) > -1 ? 6 : type === 'd' ? 0 : void 0;
        } else if (precision === '*') {
            precision = +a[i++];
        } else if ((precision as any)[0] === '*') {
            precision = +a[(precision as any).slice(1, -1)];
        } else {
            precision = +precision;
        }

        // grab value using valueIndex if required?
        let value: string | number = valueIndex
            ? a[(valueIndex as any).slice(0, -1)]
            : a[i++];

        switch (type) {
            case 's':
                return formatString(
                    String(value),
                    leftJustify,
                    minWidth,
                    precision,
                    zeroPad
                );
            case 'c':
                return formatString(
                    String.fromCharCode(+value),
                    leftJustify,
                    minWidth,
                    precision,
                    zeroPad
                );
            case 'b':
                return formatBaseX(
                    value,
                    2,
                    prefixBaseX,
                    leftJustify,
                    minWidth,
                    precision,
                    zeroPad
                );
            case 'o':
                return formatBaseX(
                    value,
                    8,
                    prefixBaseX,
                    leftJustify,
                    minWidth,
                    precision,
                    zeroPad
                );
            case 'x':
                return formatBaseX(
                    value,
                    16,
                    prefixBaseX,
                    leftJustify,
                    minWidth,
                    precision,
                    zeroPad
                );
            case 'X':
                return formatBaseX(
                    value,
                    16,
                    prefixBaseX,
                    leftJustify,
                    minWidth,
                    precision,
                    zeroPad
                ).toUpperCase();
            case 'u':
                return formatBaseX(
                    value,
                    10,
                    prefixBaseX,
                    leftJustify,
                    minWidth,
                    precision,
                    zeroPad
                );
            case 'i':
            case 'd': {
                const number = parseInt(value.toString(), 10);
                const prefix = number < 0 ? '-' : positivePrefix;
                value =
                    prefix +
                    pad(String(Math.abs(number)), precision, '0', false);
                return justify(value, prefix, leftJustify, minWidth, zeroPad);
            }
            case 'e':
            case 'E':
            case 'f':
            case 'F':
            case 'g':
            case 'G': {
                const number = +value;
                const prefix = number < 0 ? '-' : positivePrefix;
                const method = ['toExponential', 'toFixed', 'toPrecision'][
                    'efg'.indexOf(type.toLowerCase())
                    ];
                const textTransform = ['toString', 'toUpperCase'][
                'eEfFgG'.indexOf(type) % 2
                    ];
                value = prefix + (Math.abs(number) as any)[method](precision);
                return (justify(
                    value,
                    prefix,
                    leftJustify,
                    minWidth,
                    zeroPad
                ) as any)[textTransform]();
            }
            default:
                return substring;
        }
    };

    return format.replace(regex, doFormat);
};