import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Chips, { Trait } from "../components/Chips";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [traits, setTraits] = useState<Trait[]>([]);
  const [vibe, setVibe] = useState<VibeType>("Casual");
  const [generatedBios, setGeneratedBios] = useState<String>("");

  const prompt =
    vibe === "Savage"
      ? `Write a mean and mocking breakup text that makes fun of the recipient. The recipient of the letter is ${traits}.`
      : `Write a breakup text. The recipient of the letter is ${traits}.`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios(prev => prev + chunkValue);
    }

    setLoading(false);
  };

  const selectTrait = (trait: Trait) => {
    let updatedTraits = traits;
    if (traits.includes(trait)) {
      updatedTraits = traits.filter(traitEl => traitEl !== trait);
    } else {
      updatedTraits = [...traits, trait];
    }
    setTraits(updatedTraits);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Breakup Text Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4">
        <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900">
          Generate your next breakup text in seconds
        </h1>
        <p className="text-slate-500 mt-5">47,118 breakups generated so far.</p>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Select some words to describe your future ex.
            </p>
          </div>
          <Chips selectTrait={selectTrait} selectedTraits={traits} />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Select your vibe.</p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={newVibe => setVibe(newVibe)} />
          </div>

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={e => generateBio(e)}
            >
              Generate your breakup text &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {generatedBios && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      Your generated breakup texts
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                      onClick={() => {
                        navigator.clipboard.writeText(String(generatedBios));
                        toast("Breakup text copied to clipboard", {
                          icon: "✂️",
                        });
                      }}
                    >
                      <p>{generatedBios}</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
