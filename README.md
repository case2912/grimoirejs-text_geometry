# grimoire-text_geometry

plugin for Grimoire.js(<https://grimoire.gl>).

```xml
<goml>
  <geometry type="letter" name="text-text" letters="This is test.\nTest is successful." back="true" textBaseline="middle" textAlign="center"></geometry>
  <scene>
    <camera>
      <camera.components>
        <MouseCameraControl></MouseCameraControl>
      </camera.components>
    </camera>
    <text geometry="text-text"></text>
  </scene>
</goml>
```

#### geometry

|attribute|value|
|:--:|:--:|
|type|letter|
|textAlign|center, right, left|
|textBaseLine|middle, bottom, top|
|back|true, false(**The back side of the text is not drawn**)|
