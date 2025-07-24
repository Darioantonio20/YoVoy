import Button from "../atoms/Button";
import Text from "../atoms/Text";

const StoreCard = ({ store, onSelect }) => {
  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200">
      <div className="w-16 h-16 mb-3 rounded-full flex items-center justify-center bg-white/20 border border-white/30">
        <span className="text-3xl select-none">{store.logo}</span>
      </div>
      <Text variant="h3" size="lg" className="text-white mb-1 font-semibold text-base sm:text-lg">
        {store.name}
      </Text>
      <span className="inline-block bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/30 mb-3">
        {store.category}
      </span>
      <Button variant="fire" className="mx-auto block text-xs py-1 px-4 sm:text-sm sm:py-2 sm:px-6 min-w-0 w-auto" onClick={() => onSelect(store)}>
        Ver
      </Button>
    </div>
  );
};

export default StoreCard; 