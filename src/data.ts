export interface Painting {
    id: string;
    title: string;
    image: any;
  }
  
  export const artistInfo = {
    name: "Vincent van Gogh",
    bio: "A Dutch post-impressionist painter who is one of the most famous and influential figures in the history of Western art...",
    photo: require('../assets/images/artist-photo.jpg') 
  };
  
  export const paintings: Painting[] = [
    { id: '1', title: 'Starry Night', image: require('../assets/images/painting1.jpg') },
    { id: '2', title: 'Sunflowers', image: require('../assets/images/painting2.jpg') },
    { id: '3', title: 'Café Terrace at Night', image: require('../assets/images/painting3.jpg') },
  ];