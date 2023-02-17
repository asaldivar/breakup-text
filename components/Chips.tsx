export type Trait =
  | "friend"
  | "cheater"
  | "narcissist"
  | "girlfriend"
  | "boyfriend"
  | "married"
  | "selfish"
  | "fling";

const traitOptions: Trait[] = [
  "friend",
  "cheater",
  "narcissist",
  "girlfriend",
  "boyfriend",
  "married",
  "selfish",
  "fling",
];

export default function Chips({
  selectedTraits,
  selectTrait,
}: {
  selectedTraits: Trait[];
  selectTrait: (t: Trait) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center space-x-2 mt-1">
      {traitOptions.map((trait: Trait, index) => (
        <span
          key={index}
          onClick={() => selectTrait(trait)}
          className={`px-4 py-2 mt-2 rounded-full border  font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease ${
            selectedTraits.includes(trait)
              ? `border-slate-900 text-slate-900 `
              : `border-gray-300 text-gray-500`
          }`}
        >
          {trait}
        </span>
      ))}
    </div>
  );
}
