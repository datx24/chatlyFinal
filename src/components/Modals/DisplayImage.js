import React, { useState } from "react";
var imageFile;
const DisplayImage = () => {

const [image, setImage] = useState(null);
  const onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      imageFile = img;
      setImage(URL.createObjectURL(img));
    }
  };
  console.log('this is image:', image);
  return (
    <div>
      <div>
        <div>
          <img src={image} alt="" />
          
          <input
           type="file" 
           name="myImage" 
           onChange={onImageChange} 
           style={{
            height: "50px",
            width: "82px",
            position: "absolute",
            left: "19%",
            top: "89px",
           }}
           />
         
        </div>
      </div>
    </div>
  );
};
export {imageFile};
export default DisplayImage;