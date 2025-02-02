import React, { useState, useEffect } from 'react';
import './Pet.css';

const URL = 'http://localhost:3000/'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxLCJpYXQiOjE3MzgzMTcyODksImV4cCI6MTczODMyMDg4OX0.iHibXdLPpKUMywpdxRX7pav5wQlrJmZIeY9ns-0f80w'


function PetForm() {

   useEffect(() => {
        const fetchData = async () => {
            
                const response = await fetch(URL+'pets/all', {headers: {
                    Authorization: `Bearer ${token}`
                  }})
                const data = await response.json()
                console.log(data)
            }
        fetchData()
        
   })

  const [pet, setPet] = useState({
    petName: '',
    petAge: 0,
    petSex: '',
    petPicture: ''
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
      const formData = new FormData();
      formData.append('file', selectedFile); // 'file' คือชื่อ field ที่ server คาดหวัง
  
      try {
        const response = await fetch(URL + 'upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}` // ไม่ต้อง 'Content-Type' เมื่อใช้ FormData
          },
          body: formData
        });
  
        if (!response.ok) {
          const errorData = await response.json(); // ลอง parse error response
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
        }
        const data = await response.json();
        pet.petPicture = data.file;
      } catch (error) {
        console.error('Error uploading file:', error);
      }
  
    } else {
      console.log('No file selected');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      await handleUpload();
      const petToSubmit = { ...pet };
        petToSubmit.petAge = parseInt(petToSubmit.petAge);

      const submitResponse = await fetch(URL + 'pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(petToSubmit)
      });
  
      const submitData = await submitResponse.json();
      console.log(submitData);
      if (submitData.status === 200) {
        alert('บันทึกข้อมูลสำเร็จ');
        setPet({
            petName: '',
            petAge: 0,
            petSex: '',
            petPicture: ''
        });
        setSelectedFile(null);
      }
  
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <>
    <div class="container">
    <form onSubmit={handleSubmit}>
      <label htmlFor="petName">ชื่อ:</label>
      <input
        type="text"
        id="petName"
        name="petName"
        value={pet.petName}
        onChange={handleChange}
        required
      />

      <label htmlFor="petAge">อายุ:</label>
      <input
        type="number"
        id="petAge"
        name="petAge"
        value={pet.petAge}
        onChange={handleChange}
        required
      />

      <label htmlFor="petSex">เพศ:</label>
      <select id="petSex" name="petSex" value={pet.petSex} onChange={handleChange} required>
        <option value="">เลือกเพศ</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <input type="file" onChange={handleFileChange} />

      <button type="submit">บันทึก</button>
    </form>
    </div>
    </>
  );
}

export default PetForm;