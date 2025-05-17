import React, { useState, useEffect } from 'react';
import Gallery from './components/Gallery/Gallery';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import styles from './App.module.css';

const images = [
  {
    id: 1,
    url: "fotonadia1.jpg",
    title: "Foto Ke 1",
    description: "Indahnya matahari terbenam di pantai ini masih kalah dengan indahnya senyumanmu yang selalu menerangi hariku"
  },
  {
    id: 2,
    url: "fotonadia2.jpg", 
    title: "Foto Ke 2",
     description: "Gunung Fuji mungkin tinggi dan megah, tapi cintaku padamu jauh lebih tinggi dan tak akan pernah surut"
  },
  {
    id: 3,
    url: "fotonadia3.jpg", 
    title: "Foto Ke 3",
    description: "Sejuknya hutan pinus ini mengingatkanku pada ketenangan yang kurasakan setiap kali berada di sampingmu"
  },
  {
    id: 4,
    url: "fotonadia4.JPG", 
    title: "Foto Ke 4",
    description: "Danau Toba memang luas dan dalam, tapi masih tak seluas dan sedalam rasa untukmu"
  },
  {
    id: 5,
    url: "fotonadia5.jpg", 
    title: "Foto Ke 5",
    description: "Air terjun ini mungkin menyegarkan, tapi tak semenyegarkan hadirmu yang selalu membuat hidupku lebih bermakna"
  },
  {
    id: 6,
    url: "fotonadia6.jpg", 
    title: "Foto Ke 6",
    description: "Gemerlap lampu kota di malam hari ini mengingatkanku pada binar matamu yang selalu membuatku jatuh cinta berulang kali"
  },
];

const songs = [
  {
    id: 1,
    title: "Melodi Senja",
    artist: "Musisi Lokal",
    src: "musik.mp3"
  },
  {
    id: 2,
    title: "Harmony",
    artist: "Indie Band",

    src: "musik.mp3"
  },
  {
    id: 3,
    title: "Ocean Waves",
    artist: "Nature Sounds",
    // Gunakan dummy URL yang bisa diakses lokal
    src: "https://soundbible.com/mp3/Frog_Croaking-Sam_Stebbing-1810856393.mp3"
  }
];

function App() {
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Efek untuk mengganti gambar secara otomatis jika tidak ada interaksi
  useEffect(() => {
    let interval;
    if (!showModal) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [showModal]);

  // Fungsi untuk menampilkan gambar dalam mode modal
  const openModal = (image) => {
    setModalImage(image);
    setShowModal(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Galeri Foto Nadia</h1>
        <p>Nikmati koleksi foto dengan iringan musik</p>
      </header>

      <div className={styles.content}>
        <Gallery 
          images={images} 
          onImageClick={openModal}
          currentIndex={currentImageIndex}
          setCurrentIndex={setCurrentImageIndex}
        />
        
        <MusicPlayer 
          songs={songs}
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      </div>

      {/* Modal untuk tampilan gambar yang diperbesar */}
      {showModal && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.closeButton} onClick={closeModal}>&times;</span>
            <img src={modalImage.url} alt={modalImage.title} className={styles.modalImage} />
            <div className={styles.modalInfo}>
              <h2>{modalImage.title}</h2>
              <p>{modalImage.description}</p>
            </div>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <p>© 2025 ahmad hilmy | Dibuat dengan React JS</p>
      </footer>
    </div>
  );
}

export default App;