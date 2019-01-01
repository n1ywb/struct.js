// Copyright 2018 Jeffrey M. Laughlin

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


// example:

// const State_t = Struct([
//     ['field1', 'Uint8'],
// ]);


const _types = {
  Uint8: 1,
  Int8: 1,
  Uint16: 2,
  Int16: 2,
  Uint32: 4,
  Int32: 4,
  Float32: 4,
  Float64: 8,
}


class Struct {
  constructor(fields) {
    this.fields = fields;
  }

  size() {
    return this.fields.map(e=>_types[e[1]]).reduce((a,b)=>a + b, 0);
  }

  indexof(field) {
    let fieldNum;
    fieldNum = this.fields.findIndex(_field=>(_field[0] == field));
    if (fieldNum < 0) throw new Error('unknown field', field);
    return fieldNum;
  }

  offsetof(field) {
    let fieldNum = this.indexof(field);
    return this._sizeOf(this.fields.slice(0, fieldNum));
  }

  pack(obj) {
    let buffer = new ArrayBuffer(this.size());
    var view = new DataView(buffer, 0);
    this.fields.forEach(field=>{
      let [name, type] = field;
      let size = _types[type];
      view[`set${type}`](this.offsetof(name), obj[name]);
    });
    return buffer;
  }

  unpack(buffer) {
    let obj = {};
    var view = new DataView(buffer, 0);
    this.fields.forEach(field=>{
      let [name, type] = field;
      let size = _types[type];
      obj[name] = view[`get${type}`](this.offsetof(name));
    });
    return obj;
  }
}
