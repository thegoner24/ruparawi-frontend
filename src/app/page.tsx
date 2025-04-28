import HeroBanner from "./components/HeroBanner";
import ProductContainer from "./components/ProductContainer";
import HighlightedProduct from "./components/HighlightedProduct";
import GalleryGrid from "./components/GalleryGrid";
import CollaboratorStory from "./components/CollaboratorStory";
import CommunityVoices from "./components/CommunityVoices";
import ArticleSection from "./components/ArticleSection";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <ProductContainer />
      <HighlightedProduct
        imageUrl="/highlighted.jpg"
        title="Traditional Motifs, Timeless Elegance"
        subtitle=""
        buttonText="Shop Now"
        buttonHref="#"
      />
      <GalleryGrid />
      <CollaboratorStory />
      <ArticleSection />
      <CommunityVoices />
    </>
  );
}

