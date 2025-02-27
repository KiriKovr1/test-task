class IDEncoder {
    static idRadix = 'D4EU8TKX7NF2V5R0P1SZB9AM36L';

    static encode(id: number): string {
        let code = '';
        let temp = id;
        do {
            const index = temp % IDEncoder.idRadix.length;
            temp = Math.floor(temp / IDEncoder.idRadix.length);
            code = `${IDEncoder.idRadix[index]}${code}`;
        } while (temp);
        return code;
    }

    static decode(code: string): number {
        let id = 0;
        for (let index = 0; index < code.length; index += 1) {
            const pos = IDEncoder.idRadix.indexOf(code[index]);
            if (pos >= 0) {
                id = (id * IDEncoder.idRadix.length) + pos;
            }
        }
        return id;
    }
}

export default IDEncoder