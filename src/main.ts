import gr from "grimoirejs";
import GeometryFactory from "grimoirejs-fundamental/ref/Geometry/GeometryFactory"
import Geometry from "grimoirejs-fundamental/ref/Geometry/Geometry"
import font from "raw-loader!./font.json"
import MaterialFactory from "grimoirejs-fundamental/ref/Material/MaterialFactory"
import TextSort from "raw-loader!./Shaders/Text.sort";
const fontImage = require("./../font.png");
const fontData = JSON.parse(font);
export default () => {
  async function setImage(imageData: any) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.width = 512;
      image.height = 256;
      image.src = fontImage
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const context = canvas.getContext('2d');
      image.onload = function() {
        if (context !== null) context.drawImage(image, 0, 0);
        resolve(canvas);
      }
    })
  }
  gr.register(async () => {
    gr.registerNode("text", [], {
      material: "new(text)",
      texture: ((await setImage(fontImage)) as HTMLCanvasElement).toDataURL('image/png')
    }, "mesh");
    MaterialFactory.addSORTMaterial("text", TextSort);
    GeometryFactory.addType("letter", {
      letters: {
        converter: "String",
        default: "hello world"
      },
      textAlign: {
        converter: "String",
        default: "center"
      },
      textBaseline: {
        converter: "String",
        default: "middle"
      },
      back: {
        converter: "Boolean",
        default: true
      }
    }, (gl, attrs) => {
      const geometry = new Geometry(gl)
      const positions = []
      const texCoord = []
      const indices = []
      let offsetX = 0;
      const ls = attrs.letters.split(/\r\n|\r|\n|\\n/);
      const lsjoin = ls.join("");
      const letterMaxLength = ls.reduce((a: string, b: string) => a.length <= b.length ? b.length : a.length)
      switch (attrs.textAlign) {
        case "center":
          offsetX = letterMaxLength / 2
          break;
        case "right":
          offsetX = letterMaxLength
          break;
        case "left":
          offsetX = 0;
          break;
      }
      let offsetY = 0;
      switch (attrs.textBaseline) {
        case "middle":
          offsetY = ls.length / 2
          break;
        case "top":
          offsetY = 0;
          break;
        case "bottom":
          offsetY = ls.length
          break;
      }
      for (var j = 0; j < ls.length; j++) {
        for (var i = 0; i < ls[j].length; i++) {
          positions.push(0 + i - offsetX)
          positions.push(0 + offsetY - j)
          positions.push(0)

          positions.push(1 + i - offsetX)
          positions.push(0 + offsetY - j)
          positions.push(0)

          positions.push(1 + i - offsetX)
          positions.push(-1 + offsetY - j)
          positions.push(0)

          positions.push(0 + i - offsetX)
          positions.push(-1 + offsetY - j)
          positions.push(0)
        }
      }
      for (var i = 0; i < lsjoin.length; i++) {
        const p = fontData[lsjoin.charCodeAt(i)];
        texCoord.push(p.u)
        texCoord.push(1 - p.v - p.h)

        texCoord.push(p.u + p.w)
        texCoord.push(1 - p.v - p.h)

        texCoord.push(p.u + p.w)
        texCoord.push(1 - p.v)

        texCoord.push(p.u)
        texCoord.push(1 - p.v)
      }

      for (var i = 0; i < lsjoin.length; i++) {
        indices.push(0 + i * 4)
        indices.push(3 + i * 4)
        indices.push(2 + i * 4)

        indices.push(0 + i * 4)
        indices.push(2 + i * 4)
        indices.push(1 + i * 4)
      }


      if (attrs.back) {
        for (var i = 0; i < lsjoin.length; i++) {
          indices.push(0 + i * 4)
          indices.push(2 + i * 4)
          indices.push(3 + i * 4)

          indices.push(0 + i * 4)
          indices.push(1 + i * 4)
          indices.push(2 + i * 4)
        }

      }
      geometry.addAttributes(positions, {
        POSITION: {
          size: 3
        }
      })
      geometry.addAttributes(texCoord, {
        TEXCOORD: {
          size: 2
        }
      })
      geometry.addIndex("default", indices, WebGLRenderingContext.TRIANGLES)
      return geometry
    })
  });
};
