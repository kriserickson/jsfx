namespace jsfx {
  const hasWebGL = (function () {
    try {
      const canvas = document.createElement('canvas');
      return !!( canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  })();

  export function Renderer(type: string = '', precision:string = 'highp') : jsfx.RendererInterface {
    if (type.length === 0) {
      type = hasWebGL ? 'webgl' : 'canvas';
    }

    if (type === 'webgl') {
      return new jsfx.webgl.Renderer(precision);
    }

    return new jsfx.canvas.Renderer();
  }
}
