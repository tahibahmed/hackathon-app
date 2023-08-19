import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  addDoc,
  collection,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  getDoc,
  query,
  orderBy,
  where
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
   sendEmailVerification,
    signOut
  } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
  const firebaseConfig = {
    apiKey: "AIzaSyDDK1IIPh7oLze-z745L0Iq2-TXw9iGVis",
    authDomain: "hackathon-app-ecf0e.firebaseapp.com",
    projectId: "hackathon-app-ecf0e",
    storageBucket: "hackathon-app-ecf0e.appspot.com",
    messagingSenderId: "109959340619",
    appId: "1:109959340619:web:c9ff05f5af7c314e12a3ce",
    measurementId: "G-ECRCK98T1G",
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();
const userProfile = document.getElementById("user-profile");
let createaccount = document.getElementById("Create-account");

createaccount && createaccount.addEventListener("click", (e) => {
    e.preventDefault()
  let username = document.getElementById("username");
  let email = document.getElementById("email");
  let password = document.getElementById("password1");

createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => { 
try{
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      username: username.value,
      email: email.value,
      password: password.value,
    });
    Swal.fire({
        icon: 'success',
        title: 'User register successfully',
      })
    localStorage.setItem("uid",user.uid)
    location.href="login.html"
    }catch(error){
console.log(error)
} 
   })
    .catch((error) => {
 const errmsg = error.message
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text:errmsg
      })
    });
});

let loginbtn =document.getElementById("login-btn")
loginbtn && loginbtn.addEventListener("click", (e) => {
    e.preventDefault()

    let email = document.getElementById("email");
    let password = document.getElementById("password");
  
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => { 
        const user = userCredential.user
        console.log(user)
  try{
      Swal.fire({
          icon: 'success',
          title: 'Login successfully',
        })
      localStorage.setItem("uid",user.uid)
      location.href="profile.html"
      }catch(error){
  console.log(error)
  } 
     })
      .catch((error) => {
   const errmsg = error.message
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text:errmsg
        })
      });
  });
  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        const mountainsRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(mountainsRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    })
}

const getblogdata = async () => {
  const querySnapshot = await getDocs(collection(db, "blog"));
 
  const blogbox = document.getElementById('blog-box');
  let blogContent = '';
  querySnapshot.forEach(async (doc) => {
    const postget = doc.data();

    blogContent += `
     <div class="col-12 col-md-8 mt-4 border border-3 rounded-3 " >
     
           <div class="row">
             <div class="col col-md-4 ">
                  <img src="./images/dummy.jpg" alt="Profile Picture" class="img-fluid">
                  <p> ahmedali@gmail.com</p>
             </div>
            <div class="col col-md-8">
             <p></p>
                  
                  
                  <p>${postget.blogpost}</p> 
               </div>
              <div class="col col-md-12">
                  <p>${postget.blogtext}</p>
               </div>
               <button class="btn btn-success ml-2 w-25">Edit</button>
               <button class="btn btn-danger w-25">Delete</button>
              </div>
       </div>`;
  }); 
  blogbox.innerHTML = blogContent;
}




onAuthStateChanged(auth, (user) => {
  const uid = localStorage.getItem("uid")
  getblogdata()
});



let updatebtn = document.getElementById('update-btn')

  
 updatebtn && updatebtn.addEventListener("click", async (e) => {
  e.preventDefault()
  let uid = localStorage.getItem("uid")
  let username = document.getElementById("username")

  const imageUrl = await uploadFile(fileInput.files[0])
  const washingtonRef = doc(db, "users", uid);
  await updateDoc(washingtonRef, {
      username: username.value,
      picture: imageUrl
  });
  Swal.fire({
      icon: 'success',
      title: 'User updated successfully',
  })
})

const fileInput = document.getElementById("file-input");

fileInput && fileInput.addEventListener("change", () => {
    console.log(fileInput.files[0])
    userProfile.src = URL.createObjectURL(fileInput.files[0])
})


const logoutbtn = document.getElementById("logout-btn")

logoutbtn && logoutbtn.addEventListener("click",(e)=>{
    e.preventDefault()
    signOut(auth).then(() => {
        localStorage.clear()
        location.href = "login.html"
      }).catch((error) => {
      console.log(error)
      });
})

let textarea = document.getElementById("textarea");
 let totalCounter = document.getElementById("total-counter")
 let remainingCounter =document.getElementById("remaining-counter")


const updateCounter=()=>{

   totalCounter.innerText = textarea.value.length
   remainingCounter.innerText= textarea.getAttribute("maxLength") - textarea.value.length;
}
textarea&&textarea.addEventListener("keyup",updateCounter())




const publishbtn = document.getElementById('Publish-blog')

publishbtn && publishbtn .addEventListener('click', async(e)=>{
e.preventDefault()

let blogpost = document.getElementById('postdata')
let blogtext = document.getElementById('textarea')

try {
  const docRef = await addDoc(collection(db, "blog"), {
   blogpost : blogpost.value,
   blogtext : blogtext.value,
  
  
  });

  
     
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}
})

