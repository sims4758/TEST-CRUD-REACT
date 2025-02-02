import React, { useState } from "react";
import { getAccessToken, refreshAccessToken, clearTokens } from '../services/authService'
import { sendEmail } from "../services/sendEmail";

function PetForm() {
    const API_URL = "http://localhost:3000";

  const [pet, setPet] = useState({
    petName: "",
    petAge: 0,
    petSex: "",
    petDescription: "",
    petPicture: "",
  });

  const handleChange = (event) => {
    setPet({ ...pet, [event.target.name]: event.target.value });
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
        const token = getAccessToken();
      const formData = new FormData();
      formData.append("file", selectedFile); // 'file' คือชื่อ field ที่ server คาดหวัง

      try {
        const response = await fetch(API_URL + "/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // ไม่ต้อง 'Content-Type' เมื่อใช้ FormData
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json(); // ลอง parse error response
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${
              errorData.message || "Unknown error"
            }`
          );
        }
        const data = await response.json();
        pet.petPicture = data.file;
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      console.log("No file selected");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await refreshAccessToken();
    const token = getAccessToken();
    try {
      await handleUpload();
      const petToSubmit = { ...pet };
      petToSubmit.petAge = parseInt(petToSubmit.petAge);
      const submitResponse = await fetch(API_URL + "/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(petToSubmit),
      });

      const submitData = await submitResponse.json();
      if (submitData.status === 200) {
        sendEmail(
            "kachanan.jaiboon@gmail.com",
            "New Pet Added",
            `<h1>New Pet Added</h1><br>Name: ${petToSubmit.petName}<br>Age: ${petToSubmit.petAge}<br>Sex: ${petToSubmit.petSex}<br>Description: ${petToSubmit.petDescription}`,
            "New Pet Added"
        )
        alert("บันทึกข้อมูลสำเร็จ");
        setPet({
          petName: "",
          petAge: 0,
          petSex: "",
          petPicture: "",
        });
        setSelectedFile(null);
        
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
      <h2 className="text-lg font-bold mb-4">Pet Information</h2>
      <label htmlFor="petSex">ชื่อสัตว์เลี้ยง:</label>
      <input
        type="petName"
        name="shortText"
        placeholder="ชื่อสัตว์เลี้ยง"
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <label htmlFor="petSex">อายุ:</label>
      <input
        type="petAge"
        name="numeric"
        placeholder="อายุ (ตัวเลขเท่านั้น)"
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <label htmlFor="petSex">รายละเอียด:</label>
      <textarea
        name="petDescription"
        placeholder="รายละเอียด"
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mb-2"
      ></textarea>
      <label htmlFor="petSex">เพศ:</label>
      <select
        id="petSex"
        name="petSex"
        value={pet.petSex}
        onChange={handleChange}
        required
      >
        <option value="">เลือกเพศ</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input
        type="file"
        name="file"
        onChange={handleFileChange}
        className="w-full mb-2"
      />
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}

export default PetForm;
