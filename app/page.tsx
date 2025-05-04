"use client";

import Image from "next/image";
import MatrixRain from "@/components/effects/MatrixRain";
import MatrixRainMobile from "@/components/effects/MatrixRainMobile";
import { saira } from "../lib/landing/fonts";
import { 
  ScrollSection, 
  SideBySideSection, 
  AnimatedCard, 
  ResponsiveContentBlock,
  ImageWithScroll,
  TextOverlay,
  CallToAction
} from "../lib/landing/components/animated";
import { 
  InfoCard, 
  NavButton
} from "../lib/landing/components/ui";

export default function LandingPage() {
  return (
    <div className="flex flex-col relative">
      {/* Hero Section */}
      <div className="w-full relative aspect-[9/16]">
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% via-black/70 via-80% to-black z-20 max-md:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% via-black/70 via-80% to-black z-20 md:block hidden" />
        
        {/* Background Image */}
        <Image
          src="/images/landing_bg.png"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-cover w-full opacity-100 object-top z-0"
          quality={100}
          onLoad={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.complete) {
              img.style.height = "auto";
            }
          }}
        />

        {/* Matrix Rain Effects */}
        <div className="hidden md:block absolute inset-0 z-10">
          <MatrixRain />
        </div>
        <div className="block md:hidden absolute inset-0 z-10">
          <MatrixRainMobile />
        </div>

        {/* Navigation Buttons */}
        <div className="absolute top-[40%] left-0 right-0 z-50 flex items-center justify-center">
          <div className="text-center relative w-full max-w-sm md:max-w-md lg:max-w-4xl flex flex-col gap-4">
            <NavButton href="/portal" text="Enter Game" />
            <NavButton 
              href="https://alice-3.gitbook.io/alice/season-0/token-info" 
              text="Token" 
              external 
            />
            <NavButton 
              href="https://alice-3.gitbook.io/alice/what-is-alice/quickstart" 
              text="Docs" 
              external 
            />
          </div>
        </div>
      </div>

      {/* Content Grid Section */}
      <div className="absolute top-[80%] sm:top-[75%] md:top-[65%] lg:top-[65%] xl:top-[60%] 2xl:top-[60%] left-0 right-0 mx-auto z-50 max-w-7xl w-full">
        <div className="container mx-auto">
          <ScrollSection className="mb-8 px-4">
            <h1 className={`text-2xl md:text-3xl lg:text-4xl text-white text-center font-mono ${saira.className}`}>
              THE ON-CHAIN <span className="italic">SQUID GAME</span>
            </h1>
          </ScrollSection>

          {/* Info Cards Grid */}
          <div className="px-4 overflow-hidden">
            <SideBySideSection className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 max-w-7xl mx-auto">
              <AnimatedCard isLeft={true}>
                <InfoCard
                  title="1000 Players. One Survivor."
                  content={
                    <>
                      A live gaming experience made possible by Sonic's instant finality and near-limitless throughput.
                      <br /><br />
                      Real-time, fast paced games with just moments to make your move. Only on Sonic.
                    </>
                  }
                />
              </AnimatedCard>
              <AnimatedCard isLeft={false}>
                <InfoCard
                  title="Season 0"
                  content={
                    <>
                      The beta launch of Alice—our first 10 games where early players help test, compete, and shape the game from the ground up. But this isn't just early access—it's also our token distribution event.
                      <br /><br />
                      We are distributing 50% of the total ALICE supply to our early users. For now, everyone is a winner.
                    </>
                  }
                />
              </AnimatedCard>
            </SideBySideSection>
          </div>

          {/* Content Blocks */}
          <div className="space-y-8 md:mt-8">
          <div className="pt-24">
              <ImageWithScroll
                src="/images/renders/landing_register.png"
                alt="Getting Started"
              />
              <div className="relative z-10 -mt-[200px] sm:-mt-[250px] md:-mt-[300px] lg:-mt-[375px]">
                <TextOverlay
                  title="Getting Started"
                  content={
                    <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <span className="mr-4 font-bold text-md text-primary-300">1</span>
                          <div>
                            <div className="font-bold text-md">Get 101 Sonic</div>
                            <div className="opacity-80 mt-2">
                              You'll need Sonic to enter games and pay for gas. Use deBridge to bridge to Sonic if you don't have funds there.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start">
                          <span className="mr-4 font-bold text-md text-primary-300">2</span>
                          <div>
                            <div className="font-bold text-md">Connect Your Wallet</div>
                            <div className="opacity-80 mt-2 text-sm">
                              Authenticate to prove ownership of your address. Only verified players can enter.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start">
                          <span className="mr-4 font-bold text-md text-primary-300">3</span>
                          <div>
                            <div className="font-bold text-md">Register for a Game</div>
                            <div className="opacity-80 mt-2 text-sm">
                              Pay the entry fee to register for a game.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start">
                          <span className="mr-4 font-bold text-md text-primary-300">4</span>
                          <div>
                            <div className="font-bold text-md">Get Your Player Number</div>
                            <div className="opacity-80 mt-2 text-sm">
                              This is who you are now. You'll enter the Nexus — a live lobby where players gather, chat, and wait for the next round to begin.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>

            <div className="pt-24">
              <ResponsiveContentBlock
                imageUrl="/images/renders/landing_comms.png"
                title={
                  <div className="w-full font-mono ">
                    <div className="text-center text-lg">Real-Time Chat</div>
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary-300 to-transparent my-6" />
                    <div className="text-sm opacity-80 text-left space-y-8">
                    
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div>
                            <div className="font-bold">Private Chat Rooms</div>
                            <div className="text-sm opacity-80 mt-1">Each game and the Nexus has its own chat, accessible only to active players.</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div>
                            <div className="font-bold">Wallet-Gated Access</div>
                            <div className="text-sm opacity-80 mt-1">You must connect your wallet and be alive in the game to participate.</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div>
                            <div className="font-bold">Anonymized Messaging</div>
                            <div className="text-sm opacity-80 mt-1">All messages display only your player number — no usernames, no profile info.</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div>
                            <div className="font-bold">No Spectators</div>
                            <div className="text-sm opacity-80 mt-1">Eliminated players lose access to chat immediately.</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div>
                            <div className="font-bold">Strategic Communication</div>
                            <div className="text-sm opacity-80 mt-1">Use the chat to coordinate, deceive, or stay silent. What you say — or don't — can change everything.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                desktopImageFirst={true}
                mobileImageFirst={true}
              />
            </div>
           
            <div className="pt-24">
              <ResponsiveContentBlock
                imageUrl="/images/renders/landing_games.png"
                title={
                  <div className="w-full">
                    <div className="text-center text-lg font-mono">The Games</div>
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary-300 to-transparent my-6" />
                    <div className="text-sm opacity-80 text-left space-y-6 font-mono">
                      <div>
                        Alice includes a growing library of mini-games.<br />
                        There are 5 games currently live, with more on the way.
                      </div>

                      <div>
                        Each game is designed to be easy to understand but difficult — or impossible — to truly master. Success often depends on predicting or influencing the decisions of other players.
                      </div>

                      <div>
                        We don't reveal the rules in advance.<br />
                        Part of the game is not knowing what you're walking into.
                      </div>

                      <div>
                        You'll find images of all current games on this page.<br />
                        But don't bother studying them.<br />
                        What you see won't help you.
                      </div>
                    </div>
                  </div>
                }
                desktopImageFirst={false}
                mobileImageFirst={true}
              />
            </div>

            <div className="pt-24">
              <CallToAction />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
