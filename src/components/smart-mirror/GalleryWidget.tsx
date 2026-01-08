// import { useEffect, useState } from "react";

// interface GalleryResponse {
//   count: number;
//   images: string[];
// }

// const DEVICE_ID = "LUMI-001"; // later: env / backend config

// export default function GalleryWidget() {
//   const [images, setImages] = useState<string[]>([]);
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     fetch(`http://localhost:8000/gallery?device_id=${DEVICE_ID}`)
//       .then(res => res.json())
//       .then((data: GalleryResponse) => {
//         if (data.images) setImages(data.images);
//       })
//       .catch(console.error);
//   }, []);

//   // rotate images
//   useEffect(() => {
//     if (images.length === 0) return;

//     const timer = setInterval(() => {
//       setIndex(i => (i + 1) % images.length);
//     }, 8000);

//     return () => clearInterval(timer);
//   }, [images]);

//   if (images.length === 0) {
//     return (
//       <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xl">
//         No memories yet
//       </div>
//     );
//   }

//   return (
//     <div className="absolute inset-0 overflow-hidden">
//       <img
//         src={images[index]}
//         alt="Memory"
//         className="w-full h-full object-cover transition-opacity duration-1000"
//       />
//     </div>
//   );
// }
