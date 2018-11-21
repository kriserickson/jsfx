namespace jsfx.filter {
  /**
   * @filter           Multiply
   */
  export class Multiply extends IterableFilter {
    constructor(r : number, g : number, b : number) {
      super(null, `
            uniform sampler2D texture;
            uniform float r;
            uniform float g;
            uniform float b;
            varying vec2 texCoord;

            void main() {
                vec4 color = texture2D(texture, texCoord);
                color.r = min(1.0, color.r * r);
                color.g = min(1.0, color.g * g);
                color.b = min(1.0, color.b * b);

                gl_FragColor = color;
            }
        `);

      // set properties
      this.properties.r = Filter.clamp(0, r, 2);
      this.properties.g = Filter.clamp(0, g, 2);
      this.properties.b = Filter.clamp(0, b, 2);
    }

    public iterateCanvas(helper : jsfx.util.ImageDataHelper) : void {
      helper.r *= this.properties.r;
      helper.g *= this.properties.g;
      helper.b *= this.properties.b;
    }
  }
}
