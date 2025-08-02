export interface TextOperation {
  ops: Array<{
    retain?: number;
    insert?: string;
    delete?: number;
  }>;
  baseLength: number;
  targetLength: number;
}

export class OperationalTransforms {
  static createOperation(baseLength: number): TextOperation {
    return {
      ops: [],
      baseLength,
      targetLength: baseLength
    };
  }

  static retain(op: TextOperation, n: number): TextOperation {
    if (n === 0) return op;
    
    const lastOp = op.ops[op.ops.length - 1];
    if (lastOp && lastOp.retain) {
      lastOp.retain += n;
    } else {
      op.ops.push({ retain: n });
    }
    return op;
  }

  static insert(op: TextOperation, text: string): TextOperation {
    if (text === '') return op;
    
    const lastOp = op.ops[op.ops.length - 1];
    if (lastOp && lastOp.insert) {
      lastOp.insert += text;
    } else {
      op.ops.push({ insert: text });
    }
    op.targetLength += text.length;
    return op;
  }

  static delete(op: TextOperation, n: number): TextOperation {
    if (n === 0) return op;
    
    const lastOp = op.ops[op.ops.length - 1];
    if (lastOp && lastOp.delete) {
      lastOp.delete += n;
    } else {
      op.ops.push({ delete: n });
    }
    op.targetLength -= n;
    return op;
  }

  static apply(text: string, op: TextOperation): string {
    if (text.length !== op.baseLength) {
      throw new Error('Operation base length does not match text length');
    }

    let result = '';
    let textIndex = 0;

    for (const operation of op.ops) {
      if (operation.retain) {
        result += text.slice(textIndex, textIndex + operation.retain);
        textIndex += operation.retain;
      } else if (operation.insert) {
        result += operation.insert;
      } else if (operation.delete) {
        textIndex += operation.delete;
      }
    }

    result += text.slice(textIndex);
    return result;
  }

  static transform(op1: TextOperation, op2: TextOperation, priority: boolean = false): TextOperation {
    if (op1.baseLength !== op2.baseLength) {
      throw new Error('Operations must have the same base length');
    }

    const result = this.createOperation(op2.targetLength);
    let i1 = 0, i2 = 0;
    let ops1 = op1.ops, ops2 = op2.ops;

    while (i1 < ops1.length || i2 < ops2.length) {
      const op1Current = ops1[i1];
      const op2Current = ops2[i2];

      if (!op1Current) {
        this.processOp2(result, op2Current);
        i2++;
      } else if (!op2Current) {
        this.processOp1(result, op1Current);
        i1++;
      } else if (op1Current.retain && op2Current.retain) {
        const minRetain = Math.min(op1Current.retain, op2Current.retain);
        this.retain(result, minRetain);
        
        op1Current.retain -= minRetain;
        op2Current.retain -= minRetain;
        
        if (op1Current.retain === 0) i1++;
        if (op2Current.retain === 0) i2++;
      } else if (op1Current.insert) {
        this.retain(result, op1Current.insert.length);
        i1++;
      } else if (op2Current.insert) {
        this.insert(result, op2Current.insert);
        i2++;
      } else if (op1Current.delete && op2Current.delete) {
        const minDelete = Math.min(op1Current.delete, op2Current.delete);
        
        op1Current.delete -= minDelete;
        op2Current.delete -= minDelete;
        
        if (op1Current.delete === 0) i1++;
        if (op2Current.delete === 0) i2++;
      } else if (op1Current.delete && op2Current.retain) {
        const minLength = Math.min(op1Current.delete, op2Current.retain);
        
        op1Current.delete -= minLength;
        op2Current.retain -= minLength;
        
        if (op1Current.delete === 0) i1++;
        if (op2Current.retain === 0) i2++;
      } else if (op1Current.retain && op2Current.delete) {
        const minLength = Math.min(op1Current.retain, op2Current.delete);
        this.delete(result, minLength);
        
        op1Current.retain -= minLength;
        op2Current.delete -= minLength;
        
        if (op1Current.retain === 0) i1++;
        if (op2Current.delete === 0) i2++;
      }
    }

    return result;
  }

  private static processOp1(result: TextOperation, op: any): void {
    if (op.retain) this.retain(result, op.retain);
    else if (op.insert) this.retain(result, op.insert.length);
  }

  private static processOp2(result: TextOperation, op: any): void {
    if (op.retain) this.retain(result, op.retain);
    else if (op.insert) this.insert(result, op.insert);
    else if (op.delete) this.delete(result, op.delete);
  }

  static compose(op1: TextOperation, op2: TextOperation): TextOperation {
    if (op1.targetLength !== op2.baseLength) {
      throw new Error('First operation target length must equal second operation base length');
    }

    const result = this.createOperation(op1.baseLength);
    result.targetLength = op2.targetLength;

    let i1 = 0, i2 = 0;
    let ops1 = op1.ops, ops2 = op2.ops;

    while (i1 < ops1.length || i2 < ops2.length) {
      const op1Current = ops1[i1];
      const op2Current = ops2[i2];

      if (!op1Current) {
        this.processOp2(result, op2Current);
        i2++;
      } else if (!op2Current) {
        this.processOp1Compose(result, op1Current);
        i1++;
      } else if (op1Current.delete) {
        this.delete(result, op1Current.delete);
        i1++;
      } else if (op2Current.insert) {
        this.insert(result, op2Current.insert);
        i2++;
      } else if (op1Current.retain && op2Current.retain) {
        const minRetain = Math.min(op1Current.retain, op2Current.retain);
        this.retain(result, minRetain);
        
        op1Current.retain -= minRetain;
        op2Current.retain -= minRetain;
        
        if (op1Current.retain === 0) i1++;
        if (op2Current.retain === 0) i2++;
      } else if (op1Current.retain && op2Current.delete) {
        const minLength = Math.min(op1Current.retain, op2Current.delete);
        this.delete(result, minLength);
        
        op1Current.retain -= minLength;
        op2Current.delete -= minLength;
        
        if (op1Current.retain === 0) i1++;
        if (op2Current.delete === 0) i2++;
      } else if (op1Current.insert && op2Current.retain) {
        const minLength = Math.min(op1Current.insert.length, op2Current.retain);
        this.insert(result, op1Current.insert.slice(0, minLength));
        
        op1Current.insert = op1Current.insert.slice(minLength);
        op2Current.retain -= minLength;
        
        if (op1Current.insert === '') i1++;
        if (op2Current.retain === 0) i2++;
      } else if (op1Current.insert && op2Current.delete) {
        const minLength = Math.min(op1Current.insert.length, op2Current.delete);
        
        op1Current.insert = op1Current.insert.slice(minLength);
        op2Current.delete -= minLength;
        
        if (op1Current.insert === '') i1++;
        if (op2Current.delete === 0) i2++;
      }
    }

    return result;
  }

  private static processOp1Compose(result: TextOperation, op: any): void {
    if (op.retain) this.retain(result, op.retain);
    else if (op.insert) this.insert(result, op.insert);
    else if (op.delete) this.delete(result, op.delete);
  }

  static invert(op: TextOperation, text: string): TextOperation {
    const result = this.createOperation(op.targetLength);
    result.targetLength = op.baseLength;
    
    let textIndex = 0;

    for (const operation of op.ops) {
      if (operation.retain) {
        this.retain(result, operation.retain);
        textIndex += operation.retain;
      } else if (operation.insert) {
        this.delete(result, operation.insert.length);
      } else if (operation.delete) {
        this.insert(result, text.slice(textIndex, textIndex + operation.delete));
        textIndex += operation.delete;
      }
    }

    return result;
  }

  static toJSON(op: TextOperation): any {
    return {
      ops: op.ops,
      baseLength: op.baseLength,
      targetLength: op.targetLength
    };
  }

  static fromJSON(json: any): TextOperation {
    return {
      ops: json.ops || [],
      baseLength: json.baseLength || 0,
      targetLength: json.targetLength || 0
    };
  }
}
