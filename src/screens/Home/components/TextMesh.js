import { THREE } from 'expo-three'; // 2.2.2-alpha.1
import AssetUtils from 'expo-asset-utils' // 0.0.4-alpha.0
class TextMesh extends THREE.Mesh {
  params = {};
  get text() {
    return this.params.text;
  }
  set text(text) {
    this.update({text});
  }

/*
font — an instance of THREE.Font.
size — Float. Size of the text. Default is 100.
height — Float. Thickness to extrude text. Default is 50.
curveSegments — Integer. Number of points on the curves. Default is 12.
bevelEnabled — Boolean. Turn on bevel. Default is False.
bevelThickness — Float. How deep into text bevel goes. Default is 10.
bevelSize — Float. How far from text outline is bevel. Default is 8.
bevelSegments — Integer. Number of bevel segments. Default is 3.
*/
  update = async (props = {}) => {
    this.params = { ...this.params, ...props };
    if (this.geometry) {
      this.geometry.dispose();
    }
    
    
    const {font } = this.params;
      console.log('font', font, font instanceof THREE.Font)
    if (!font) {
      console.warn("TextMesh.updateWithParams: font is required to create TextBufferGeometry!");
      return;
    } else if (!(font instanceof THREE.Font)) {
        console.log('here', typeof font)
      if (typeof font === 'object') {
        this.params.font = this.loadFontFromJson(font);
      } else if (typeof font === 'string') {
        const uri = await AssetUtils.uriAsync(font);
        this.params.font = this.loadFontFromUriAsync(uri);
      }
    }
      console.log('this.params', this.params)
    this.geometry = new THREE.TextBufferGeometry(
      this.params.text || this.text,
      this.params
    );
    this.geometry.computeBoundingBox();
    this.geometry.computeVertexNormals();
    return this.geometry;
  };
  loadFontFromJson = json => {
      console.log ( 'loadfontfromjson', json)
    const font = new THREE.FontLoader().parse(json);
    this.update({ font });
    return font;
  };
  loadFontFromUriAsync = async uri => {
    const font = await this._loadFontFromUriAsync(uri);
    this.update({ font });
    return font;
  };
  _loadFontFromUriAsync = async uri => {
    new Promise((res, rej) =>
      new THREE.FontLoader().load(uri, res, () => {}, rej)
    );
  };
}
export default TextMesh;
