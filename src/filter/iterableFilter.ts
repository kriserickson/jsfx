namespace jsfx.filter {
    export class IterableFilter extends Filter implements IterableFilterInterface {
        public drawCanvas(renderer: jsfx.canvas.Renderer): void {
            return IterableFilter.drawCanvas([this], renderer);
        }

        public iterateCanvas(imageData: jsfx.util.ImageDataHelper): void {
            throw new Error("Must be implemented");
        }

        static drawCanvas(filters: IterableFilterInterface[], renderer: jsfx.canvas.Renderer): void {
            let helper: jsfx.util.ImageDataHelper;
            const imageData: ImageData = renderer.getImageData();

            for (let i = 0; i < imageData.data.length; i += 4) {
                helper = new jsfx.util.ImageDataHelper(imageData, i);

                filters.forEach((filter: IterableFilterInterface) => {
                    filter.iterateCanvas(helper);
                });

                helper.save();
            }
        }
    }
}
