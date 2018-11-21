namespace jsfx.filter {
  /**
   * @filter           ColorFilter
   */
  export class ColorFilter extends IterableFilter {
    constructor(r : number, g : number, b : number, adj : number) {
      super(null, `
            uniform sampler2D texture;
            uniform float r;
            uniform float g;
            uniform float b;
            uniform float adj;
            varying vec2 texCoord;

            void main() {
                vec4 color = texture2D(texture, texCoord);
                color.r = max(0.0, min(1.0, color.r - ((color.r - r) * adj)));
                color.g = max(0.0, min(1.0, color.g - ((color.g - g) * adj)));
                color.b = max(0.0, min(1.0, color.b - ((color.b - b) * adj)));

                gl_FragColor = color;
            }
        `);

      // set properties
      this.properties.r = Filter.clamp(0, r / 255, 1);
      this.properties.g = Filter.clamp(0, g / 255, 1);
      this.properties.b = Filter.clamp(0, b / 255, 1);
      this.properties.adj = Filter.clamp(0, adj,  1);
    }

    public iterateCanvas(helper : jsfx.util.ImageDataHelper) : void {
      helper.r = Math.min(1, Math.max(0,  helper.r - ((helper.r - this.properties.r) * this.properties.adj)));
      helper.g = Math.min(1, Math.max(0,  helper.g - ((helper.g - this.properties.g) * this.properties.adj)));
      helper.b = Math.min(1, Math.max(0,  helper.b - ((helper.b - this.properties.b) * this.properties.adj)));
    }
  }
}
