namespace jsfx.filter {
    declare var Uint8ClampedArray: any;

    /**
     * @filter         Unsharp Mask
     * @description    A form of image sharpening that amplifies high-frequencies in the image. It
     *                 is implemented by scaling pixels away from the average of their neighbors.
     * @param radius   0 to 180 - The blur radius that calculates the average of the neighboring pixels.
     * @param strength A scale factor where 0 is no effect and higher values cause a stronger effect.
     * @note           Could potentially be converted to an IterableFilter, but we somehow need the original ImageData
     */
    export class UnsharpMask extends Filter {
        constructor(radius?: number, strength ?: number) {
            super(null, `
            uniform sampler2D blurredTexture;
            uniform sampler2D originalTexture;
            uniform float strength;
            uniform float threshold;
            varying vec2 texCoord;

            void main() {
                vec4 blurred = texture2D(blurredTexture, texCoord);
                vec4 original = texture2D(originalTexture, texCoord);
                gl_FragColor = mix(blurred, original, 1.0 + strength);
            }
        `);

            // set properties
            this.properties.radius = radius;
            this.properties.strength = strength;
        }

        drawWebGL(renderer: jsfx.webgl.Renderer): void {
            const shader = renderer.getShader(this);
            const radius = this.properties.radius;
            const strength = this.properties.strength;

            // create a new texture
            const extraTexture = renderer.createTexture();

            // use a texture and draw to it
            renderer.getTexture().use();
            extraTexture.drawTo(renderer.getDefaultShader().drawRect.bind(renderer.getDefaultShader()));

            // blur current texture
            extraTexture.use(1);

            // draw the blur
            const blur = new Blur(radius);
            blur.drawWebGL(renderer);

            // use the stored texture to detect edges
            shader.textures({
                originalTexture: 1
            });

            renderer.getTexture().use();
            renderer.getNextTexture().drawTo(function () {
                shader.uniforms({strength: strength}).drawRect();
            });

            extraTexture.unuse(1);
        }

        public drawCanvas(renderer: jsfx.canvas.Renderer): void {
            const original: number[] = new Uint8ClampedArray(renderer.getImageData().data);

            // props
            const radius = this.properties.radius;
            const strength = this.properties.strength + 1;

            // blur image
            const blur = new Blur(radius);
            blur.drawCanvas(renderer);

            // get processed image data
            const imageData: ImageData = renderer.getImageData();
            const pixels: Uint8ClampedArray = imageData.data;

            for (let i = 0; i < pixels.length; i += 4) {
                pixels[i] = jsfx.util.ImageDataHelper.mix(pixels[i], original[i], strength);
                pixels[i + 1] = jsfx.util.ImageDataHelper.mix(pixels[i + 1], original[i + 1], strength);
                pixels[i + 2] = jsfx.util.ImageDataHelper.mix(pixels[i + 2], original[i + 2], strength);
            }

            renderer.setImageData(imageData);
        }
    }
}
