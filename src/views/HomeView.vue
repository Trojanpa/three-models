<!--
 * @description: 模型加载
 * @fileName: HomeView.vue
 * @author: hoo
 * @date: 2023-01-29 17:22:45
!-->

<template>
  <div class="home-view-container">
    <div id="canvasId"></div>
  </div>
</template>

<script>
// 轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import modelsJson from "@/assets/json/models";
import * as THREE from "three";
let that;

export default {
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      axes: null,
      controls: null,
      ctrlObj: {},
      ctrl: null,
      spotLight: null,
      wheels: [],
    };
  },
  mounted() {
    that = this;
    this.init();
    window.addEventListener("resize", this.onWindowResize.bind(this));
  },
  methods: {
    init() {
      this.scene = new THREE.Scene();
      // 透视投影摄像机，参数：摄像机能看到的那部分场景（即视角。值越小看到的场景越小，物体越大）、渲染的长宽比（长宽比越小场景越扁，物体越扁）、摄像机从多近的位置开始渲染、相机从它所处的位置能看多远
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer();
      // 设置背景颜色(默认背景色黑色)
      this.renderer.setClearColor(new THREE.Color(0x000000));
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      document.getElementById("canvasId").appendChild(this.renderer.domElement);

      // 添加三维坐标轴，轴长50
      this.axes = new THREE.AxesHelper(50);
      this.scene.add(this.axes);

      this.camera.position.x = 1.8;
      this.camera.position.y = 0.6;
      this.camera.position.z = 20;
      this.camera.lookAt(this.scene.position);
      this.scene.add(this.camera);

      // 创建轨道控制器
      this.createControls();

      // 聚光灯光源。参数：聚光灯光源颜色、光照强度、光源发出光的最大距离、光线散射角度、聚光锥的半影衰减百分比、沿着光照距离的衰减量
      this.spotLight = new THREE.SpotLight(0xffffff);
      // 设置光源位置
      this.spotLight.position.set(0, 30, 60);
      // 设置光源能发射投影
      this.spotLight.castShadow = true;
      // 设置阴影效果
      this.scene.add(this.spotLight);

      // 环境光
      const ambientLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(ambientLight);

      // 加载场景
      this.createPanorama("scene1.png");
      // 加载模型
      this.loadAllModels();

      this.renderScene();
    },
    // 渲染
    renderScene() {
      // 更新轨道控制器
      // this.controls.update();

      // 让跑车的四个车轮旋转起来
      const time = -performance.now() / 1000;
      for (let i = 0; i < this.wheels.length; i++) {
        this.wheels[i].rotation.x = time * Math.PI * 2;
      }

      requestAnimationFrame(this.renderScene);
      this.renderer.render(this.scene, this.camera);
    },
    // 加载多个模型
    loadAllModels() {
      const modelsList = modelsJson || [];
      console.log("modelsJson", modelsList);
      modelsList.forEach((model) => {
        this.loadModel(model);
      });
    },
    // 加载glTF模型
    loadModel(model = {}) {
      const { name, ext } = model;
      const gltfLoader = new GLTFLoader();
      // 使用Draco库压缩的几何体的加载器。
      const dracoLoader = new DRACOLoader();
      // Draco是一个用于压缩和解压缩3D网格和点云的开源库。
      dracoLoader.setDecoderPath("/static/libs/draco/");
      gltfLoader.setDRACOLoader(dracoLoader);
      gltfLoader.setPath(`static/models/${ext}/`);
      gltfLoader.load(`${name}.${ext}`, (gltf) => {
        if (name === "ferrari") {
          that.changeStyle(gltf);
        } else {
          that.scene.add(gltf.scene);
        }
      });
    },
    changeStyle(gltf) {
      const shadow = new THREE.TextureLoader().load("static/models/glb/ferrari_ao.png");
      // 主体材质
      const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1a2ec1,
        metalness: 1.0,
        roughness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.2,
      });
      // 细节材质
      const detailsMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.5,
      });
      // 玻璃材质
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.25,
        roughness: 0,
        transmission: 1.0,
      });
      const carModel = gltf.scene.children[0];
      carModel.scale.multiplyScalar(4);
      carModel.rotation.y = Math.PI;
      carModel.getObjectByName("body").material = bodyMaterial;
      carModel.getObjectByName("rim_fl").material = detailsMaterial;
      carModel.getObjectByName("rim_fr").material = detailsMaterial;
      carModel.getObjectByName("rim_rr").material = detailsMaterial;
      carModel.getObjectByName("rim_rl").material = detailsMaterial;
      carModel.getObjectByName("trim").material = detailsMaterial;
      carModel.getObjectByName("glass").material = glassMaterial;
      // 获取跑车四个车轮
      that.wheels.push(
        carModel.getObjectByName("wheel_fl"),
        carModel.getObjectByName("wheel_fr"),
        carModel.getObjectByName("wheel_rl"),
        carModel.getObjectByName("wheel_rr"),
      );
      // shadow
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
        new THREE.MeshBasicMaterial({
          map: shadow,
          blending: THREE.MultiplyBlending,
          toneMapped: false,
          transparent: true,
        }),
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.renderOrder = 2;
      carModel.add(mesh);
      // that.scene.add(gltf.scene);
      that.scene.add(carModel);
    },
    // 加载场景球体全景
    createPanorama(pngName) {
      const geometry = new THREE.SphereGeometry(500, 100, 100);
      const material = new THREE.MeshBasicMaterial({
        // 导入图片
        map: new THREE.TextureLoader().load(`static/textures/scene/${pngName}`),
        color: 0xffffff,
        side: THREE.BackSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
    },
    // 场景自适应
    onWindowResize() {
      // 更新相机宽高比
      this.camera.aspect = window.innerWidth / window.innerHeight;
      // 更新相机投影矩阵
      this.camera.updateProjectionMatrix();
      // 重置场景的渲染尺寸
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    // 创建轨道控制器控对象。这样我们就可以对画布进行操作了，如：用滚轮进行缩放，用鼠标左键进行拖拽，用鼠标右键进行平移。
    createControls() {
      //  创建轨道控制器控对象。参数：相机对象、用于事件监听的HTML元素
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // this.controls.update();
      // 采用另一种方法来实现坐标轴旋转，即在轨道控制器的change事件添加渲染函数作为它的回调函数，这样当我们拖动鼠标的时候就可以实时渲染画面了
      this.controls.addEventListener("change", this.renderScene);
    },
  },
};
</script>

<style lang="less" scoped>
.home-view-container {
}
</style>
