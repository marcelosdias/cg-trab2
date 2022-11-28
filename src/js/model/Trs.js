class TRS {
    constructor() {
        this.translation = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.scale = [1, 1, 1];
    }

    getMatrix(dst) {
        dst = dst || new Float32Array(16);
        
        let t = this.translation;
        let r = this.rotation;
        let s = this.scale;
      
        m4.translation(t[0], t[1], t[2], dst);
        m4.xRotate(dst, r[0], dst);
        m4.yRotate(dst, r[1], dst);
        m4.zRotate(dst, r[2], dst);
        m4.scale(dst, s[0], s[1], s[2], dst);

        return dst;
    }
}