// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnimatedDivider from "../components/AnimatedDivider";
import { BRAND_COLORS } from "../utils/theme";
import { getProject } from "../data/projects";
import { CASE_STUDIES } from "../data/caseStudyContent";
import SectionPreheader from "../components/SectionPreheader";
import EmailShowcase from "../components/EmailShowcase";
import PullQuote from "../components/PullQuote";
import StatGrid from "../components/StatGrid";
import LightboxGallery from "../components/LightboxGallery";
import AwardCard from "../components/AwardCard";
import Timeline from "../components/Timeline";
import ProductionCarousel from "../components/ProductionCarousel";
import ShowcaseCarousel from "../components/ShowcaseCarousel";
import ImpactList from "../components/ImpactList";
import AffinityMap from "../components/AffinityMap";
import AffinityMap2 from "../components/AffinityMap2";
import AffinityMapDisplayNow from "../components/AffinityMapDisplayNow";
import TOWSMatrix from "../components/TOWSMatrix";
import ProblemSolutionTransition from "../components/ProblemSolutionTransition";
import DisplayNowMockup from "../components/DisplayNowMockup";
import ArchiveMockup from "../components/ArchiveMockup";
import UsabilitySummary from "../components/UsabilitySummary";
import Solve24UsabilitySummary from "../components/Solve24UsabilitySummary";
import QuoteGrid from "../components/QuoteGrid";
import PersonaCards from "../components/PersonaCards";
import InteractiveUserFlow from "../components/InteractiveUserFlow";
import InteractiveUserFlowToBe from "../components/InteractiveUserFlowToBe";
import {
  DebugSpacer,
  DebugFlexCol,
  useLayoutDebugger,
} from "../components/LayoutDebugger";

// Helper to render visual aids dynamically
const renderVisualAid = (data, color) => {
  if (!data) return null;
  switch (data.type) {
    case "PullQuote":
      return <PullQuote {...data} color={color} />;
    case "ImageGallery":
      return <LightboxGallery images={data.images} />;
    case "StatGrid":
      return <StatGrid {...data} color={color} theme={data.theme || "light"} />; // Pass highlight color & theme
    case "Timeline":
      return <Timeline {...data} color={color} />;
    case "AwardCard":
      return <AwardCard {...data} />;
    case "ImpactList":
      return <ImpactList {...data} color={color} />;
    case "InteractiveMockup":
      return <DisplayNowMockup color={color} />;
    case "ArchiveMockup":
      return (
        <ArchiveMockup
          src={data.src}
          title={data.title}
          description={data.description}
          color={color}
        />
      );
    case "UsabilitySummary":
      return <UsabilitySummary data={data} color={color} />;
    case "QuoteGrid":
      return <QuoteGrid quotes={data.quotes} activeColor={color} />;
    case "InteractiveUserFlow":
      return <InteractiveUserFlow color={color} />;
    case "PaddedImage":
      return (
        <div className="w-full bg-brand-light px-6 md:px-10 py-[1px] -mx-6 md:-mx-12 lg:-mx-24 rounded-none lg:rounded-theme-md mt-12 mb-8">
          <DebugSpacer id="PaddedImage_Top" defaultMobile={24} defaultDesktop={40} />
          {(data.kicker || data.title) && (
             <div className="mb-8">
               {data.kicker && <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#6e8291] mb-2">{data.kicker}</h4>}
               {data.title && <h3 className="text-2xl md:text-3xl font-bold font-outfit text-brand-ink tracking-tight">{data.title}</h3>}
             </div>
          )}
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm relative bg-white">
            <img
              src={data.src}
              alt={data.alt || "Visual Reference"}
              className="w-full h-auto block"
            />
          </div>
          <DebugSpacer id="PaddedImage_Bottom" defaultMobile={24} defaultDesktop={40} />
        </div>
      );
    case "Image":
      return (
        <div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm mt-8 relative bg-white">
          <img
            src={data.src}
            alt={data.alt || "Visual Reference"}
            className="w-full h-auto block"
          />
        </div>
      );
    default:
      return null;
  }
};

// Helper to parse bold text from markdown-style strings
// Helper to parse bold text from markdown-style strings
const parseBodyText = (text) => {
  if (!text) return text;
  // Split by **bold** OR *italics*
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    } else if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="italic text-gray-800">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
};

// Helper component for standard Sidebar sections
const SidebarSection = ({
  id,
  data,
  activeColor,
  emailShowcase = false,
  projectId,
  isNavVisible = true,
  isHighlight = false,
  children,
}) => {
  // Ensure data exists and has either a body array, affinityMapData, or visualAid to prevent errors
  if (!data || (!data.body && !data.affinityMapData && !data.visualAid))
    return null;

  const hasSidebar = !!data.sidebar;

  return (
    <section
      id={id}
      className={
        isHighlight
          ? "bg-brand-light px-6 md:px-10 py-[1px] -mx-6 md:-mx-12 lg:-mx-24 rounded-none lg:rounded-theme-md"
          : ""
      }
    >
      {isHighlight && <DebugSpacer id={`Section_${id}_Highlight_Top`} defaultMobile={24} defaultDesktop={40} />}
      {(data.preheader || isHighlight) && (
        <React.Fragment>
          <SectionPreheader
            text={data.preheader || (isHighlight ? "Highlight" : "")}
            color={activeColor}
          />
          <DebugSpacer
            id={`Section_${id}_PreHeaderGap`}
            defaultMobile={2}
            defaultDesktop={2}
          />
        </React.Fragment>
      )}

      {data.title && (
        <React.Fragment>
          <h2
            className={`text-3xl md:text-4xl font-bold font-outfit mb-0 ${isHighlight ? "text-brand-ink" : ""}`}
          >
            {data.title}
          </h2>
          <DebugSpacer
            id={`Section_${id}_HeadlineGap`}
            defaultMobile={20}
            defaultDesktop={40}
          />
        </React.Fragment>
      )}

      <div
        className={`grid grid-cols-1 ${hasSidebar ? "lg:grid-cols-3 gap-10 lg:gap-16" : "gap-6"}`}
      >
        {/* Main Content Column */}
        <div className={hasSidebar ? "lg:col-span-2" : ""}>
          
          {/* Pre-Body Inline Visual Aids (index: -1) */}
          {data.inlineVisualAids &&
            data.inlineVisualAids.map(
              (iva, iVaIndex) =>
                iva.index === -1 && (
                  <React.Fragment key={`iva-pre-${iVaIndex}`}>
                    <div
                      className={
                        iva.data.type === "UsabilitySummary" ||
                          iva.data.type === "InteractiveUserFlow"
                          ? "mb-0 -mx-6 md:-mx-12 lg:-mx-24 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] lg:w-[calc(100%+12rem)] relative z-10"
                          : "mb-0"
                      }
                    >
                      {iva.data.type === "UsabilitySummary" && (
                        <DebugSpacer
                          id={`Inline_${iva.data.type}_pre_${iVaIndex}_InnerTop`}
                          defaultMobile={20}
                          defaultDesktop={50}
                        />
                      )}
                      {renderVisualAid(iva.data, activeColor)}
                      {iva.data.type === "UsabilitySummary" && (
                        <DebugSpacer
                          id={`Inline_${iva.data.type}_pre_${iVaIndex}_InnerBottom`}
                          defaultMobile={60}
                          defaultDesktop={60}
                        />
                      )}
                    </div>
                    {/* Only add spacer after if there is actually body content following it */}
                    {data.body && data.body.length > 0 && (
                      <DebugSpacer
                        id={`Inline_${iva.data.type}_pre_${iVaIndex}_Bottom`}
                        defaultMobile={40}
                        defaultDesktop={50}
                      />
                    )}
                  </React.Fragment>
                )
            )}

          {data.body &&
            data.body.map((paragraph, index) => {
              const isLastParagraph = index === data.body.length - 1;
              const hasInlineAidAfter =
                data.inlineVisualAids &&
                data.inlineVisualAids.some((iva) => iva.index === index);
              const isFollowedBySpecial =
                hasInlineAidAfter ||
                (emailShowcase &&
                  index === 1 &&
                  projectId === "morgan-stanley") ||
                (projectId === "coeurage" &&
                  index === 4 &&
                  id === "section3") ||
                (projectId === "coeurage" &&
                  index === 1 &&
                  id === "section3" &&
                  data.visualAid);

              const isBullet =
                typeof paragraph === "string" &&
                paragraph.trim().startsWith("•");
              const parsedParagraph = isBullet
                ? paragraph.replace(/^•\s*/, "")
                : paragraph;

              return (
                <div key={index} className="flex flex-col">
                  {isBullet ? (
                    <div className="flex pl-8 md:pl-12">
                      <div
                        className="flex-shrink-0 mt-2 w-3.5 h-3.5 rounded-full mr-6"
                        style={{ backgroundColor: activeColor }}
                      ></div>
                      <p className="text-lg text-brand-ink-body leading-relaxed m-0">
                        {parseBodyText(parsedParagraph)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-lg text-brand-ink-body leading-relaxed">
                      {parseBodyText(paragraph)}
                    </p>
                  )}
                  <DebugSpacer
                    id={`Section_${id}_Paragraph_${index}`}
                    defaultMobile={
                      isLastParagraph || isFollowedBySpecial ? 0 : 20
                    }
                    defaultDesktop={
                      isLastParagraph || isFollowedBySpecial ? 0 : 30
                    }
                  />

                  {/* Inject Email Showcase if needed */}
                  {emailShowcase &&
                    index === 1 &&
                    projectId === "morgan-stanley" && (
                      <React.Fragment>
                        <div className="w-full">
                          <EmailShowcase />
                        </div>
                        <DebugSpacer
                          id={`Section_${id}_EmailShowcase`}
                          defaultMobile={40}
                          defaultDesktop={64}
                        />
                      </React.Fragment>
                    )}

                  {/* Inline Carousel for Coeurage */}
                  {projectId === "coeurage" &&
                    index === 4 &&
                    id === "section3" && (
                      <React.Fragment>
                        <div className="w-full relative">
                          <ProductionCarousel
                            images={data.carousel?.images}
                            credit={data.carousel?.credit}
                            accentColor={activeColor}
                          />
                        </div>
                        <DebugSpacer
                          id={`Section_${id}_Carousel`}
                          defaultMobile={60}
                          defaultDesktop={100}
                        />
                      </React.Fragment>
                    )}

                  {/* Interactive To-Be Flow for Display Now */}
                  {projectId === "display-now" &&
                    id === "section5" &&
                    index === 6 && (
                      <React.Fragment>
                        <DebugSpacer
                          id={`Section_${id}_FlowBuilder_Top`}
                          defaultMobile={40}
                          defaultDesktop={60}
                        />
                        <div className="mb-0 -mx-6 md:-mx-12 lg:-mx-24 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] lg:w-[calc(100%+12rem)] relative z-10">
                          <InteractiveUserFlowToBe color="#56C6FF" />
                        </div>
                        <DebugSpacer
                          id={`Section_${id}_FlowBuilder_Bottom`}
                          defaultMobile={40}
                          defaultDesktop={60}
                        />
                      </React.Fragment>
                    )}

                  {/* Inline Quote for Coeurage (moved from bottom) */}
                  {projectId === "coeurage" &&
                    index === 1 &&
                    id === "section3" &&
                    data.visualAid && (
                      <React.Fragment>
                        <DebugSpacer
                          id={`Section_${id}_InlineQuote_Top`}
                          defaultMobile={24}
                          defaultDesktop={24}
                        />
                        <div className="w-full">
                          {renderVisualAid(data.visualAid, activeColor)}
                        </div>
                        <DebugSpacer
                          id={`Section_${id}_InlineQuote_Bottom`}
                          defaultMobile={24}
                          defaultDesktop={24}
                        />
                      </React.Fragment>
                    )}

                  {/* Generic Inline Visual Aids */}
                  {data.inlineVisualAids &&
                    data.inlineVisualAids.map(
                      (iva, iVaIndex) =>
                        iva.index === index && (
                          <React.Fragment key={`iva-${iVaIndex}`}>
                            <DebugSpacer
                              id={`Inline_${iva.data.type}_${iVaIndex}_Top`}
                              defaultMobile={40}
                              defaultDesktop={50}
                            />
                            <div
                              className={
                                iva.data.type === "UsabilitySummary" ||
                                  iva.data.type === "InteractiveUserFlow"
                                  ? "mb-0 -mx-6 md:-mx-12 lg:-mx-24 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] lg:w-[calc(100%+12rem)] relative z-10"
                                  : "mb-0"
                              }
                            >
                              {iva.data.type === "UsabilitySummary" && (
                                <DebugSpacer
                                  id={`Inline_${iva.data.type}_${iVaIndex}_InnerTop`}
                                  defaultMobile={20}
                                  defaultDesktop={50}
                                />
                              )}
                              {renderVisualAid(iva.data, activeColor)}
                              {iva.data.type === "UsabilitySummary" && (
                                <DebugSpacer
                                  id={`Inline_${iva.data.type}_${iVaIndex}_InnerBottom`}
                                  defaultMobile={60}
                                  defaultDesktop={100}
                                />
                              )}
                            </div>
                            <DebugSpacer
                              id={`Inline_${iva.data.type}_${iVaIndex}_Bottom`}
                              defaultMobile={40}
                              defaultDesktop={50}
                            />
                          </React.Fragment>
                        ),
                    )}
                </div>
              );
            })}

          {/* Inline Visual Aid (Bottom) - prevent rendering if it's the ImpactList being passed to AffinityMap in display-now */}
          {(projectId !== "coeurage" || id !== "section3") &&
            data.visualAid &&
            (projectId === "display-now" ? data.visualAid.type !== "ImpactList" : true) &&
            renderVisualAid(data.visualAid, activeColor)}

          {/* Display Now UX Personas - Injected directly after the QuoteGrid inside the main column to prevent sidebar height push down */}
          {projectId === "display-now" && id === "section3" && (
            <React.Fragment>
              <DebugSpacer
                id="DisplayNow_Personas_ContainerTop"
                defaultMobile={40}
                defaultDesktop={100}
              />
              <div className="w-full relative z-10 flex flex-col items-center mb-0">
                <DebugSpacer
                  id="DisplayNow_Personas_InnerGap"
                  defaultMobile={40}
                  defaultDesktop={0}
                />
                <div className="w-full">
                  <PersonaCards accentColor={activeColor} />
                </div>
              </div>
            </React.Fragment>
          )}

          {/* Render children (like images) */}
          {children}
        </div>

        {/* Sidebar Column */}
        {hasSidebar && (
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div
              className={`sticky transition-[top] duration-500 ease-in-out ${isNavVisible ? "top-32" : "top-20"}`}
            >
              {renderVisualAid(data.sidebar, activeColor)}
            </div>
          </div>
        )}
      </div>

      {/* Solve 24 Usability Testing Report */}
      {projectId === "solve-24" && id === "section2B" && (
        <React.Fragment>
          <DebugSpacer
            id="Solve24_Usability_Top"
            defaultMobile={40}
            defaultDesktop={50}
          />
          <div className="-mx-6 md:-mx-12 lg:-mx-24 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] lg:w-[calc(100%+12rem)] relative z-10">
            <DebugSpacer
              id="Solve24_Usability_InnerTop"
              defaultMobile={20}
              defaultDesktop={50}
            />
            <Solve24UsabilitySummary />
            <DebugSpacer
              id="Solve24_Usability_InnerBottom"
              defaultMobile={60}
              defaultDesktop={100}
            />
          </div>
        </React.Fragment>
      )}

      {/* Interactive Affinity Map 2 (Solve 24 specific) */}
      {data.affinityMapData &&
        id === "section2D" &&
        projectId === "solve-24" && (
          <React.Fragment>
            <DebugSpacer
              id="Solve24_AffinityMap_Top"
              defaultMobile={60}
              defaultDesktop={100}
            />
            <div className="-mx-6 md:-mx-12 lg:-mx-24 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] lg:w-[calc(100%+12rem)] relative z-10">
              <AffinityMap2 color={activeColor} />
            </div>
            <DebugSpacer
              id="Solve24_AffinityMap_Bottom"
              defaultMobile={0}
              defaultDesktop={0}
            />
          </React.Fragment>
        )}

      {/* Interactive Affinity Map (Display Now specific) */}
      {data.affinityMapData &&
        id === "section4" &&
        projectId === "display-now" && (
          <>
            <DebugSpacer
              id="DisplayNow_AffinityMap_Top"
              defaultMobile={60}
              defaultDesktop={100}
            />
            <div className="-mx-6 md:-mx-12 lg:-mx-24 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] lg:w-[calc(100%+12rem)] relative z-10">
              <AffinityMapDisplayNow color={activeColor} />
            </div>
            <DebugSpacer
              id="DisplayNow_AffinityMap_Bottom"
              defaultMobile={30}
              defaultDesktop={50}
            />
            <div className="-mx-6 md:-mx-12 lg:-mx-24 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] lg:w-[calc(100%+12rem)] relative z-10">
              <TOWSMatrix color={activeColor} />
            </div>
            <DebugSpacer
              id="DisplayNow_TOWS_Bottom"
              defaultMobile={0}
              defaultDesktop={0}
            />
          </>
        )}
      {isHighlight && <DebugSpacer id={`Section_${id}_Highlight_Bottom`} defaultMobile={24} defaultDesktop={40} />}
    </section>
  );
};

const CaseStudyTemplate = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { applyOverrides } = useLayoutDebugger();
  // Scroll Logic for Dynamic Sticky Positioning (Sync with Navbar)
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const showTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const threshold = 10;

      if (Math.abs(currentScrollY - lastScrollY.current) < threshold) return;

      if (currentScrollY < 50) {
        setIsNavVisible(true);
        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling Down
        setIsNavVisible(false);
        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      } else {
        // Scrolling Up
        setIsNavVisible(true);
        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = setTimeout(() => {
          setIsNavVisible(false);
        }, 5000);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    };
  }, []);

  // Retrieve Data
  const project = getProject(projectId);

  // Fallback if ID invalid or direct access
  useEffect(() => {
    if (!project && projectId) {
      // Optional: navigate('/404')
    }
  }, [project, projectId, navigate]);

  // Apply Case Study Layout Overrides
  useEffect(() => {
    if (project?.customLayoutKeys) {
      applyOverrides(project.customLayoutKeys);
    }
  }, [projectId, project, applyOverrides]);

  // Use default/fallback data if no project found
  const data = project || {
    title: "Studio Nive",
    desc: "Creative direction and brand identity for a fashion-focused design studio aiming for global markets.",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2940&auto=format&fit=crop",
    themeColor: BRAND_COLORS.black,
    cat: "Content Consulting",
    discipline: "screen",
  };

  // Retrieve Case Study Content (Text/Body)
  const content = CASE_STUDIES[projectId] || CASE_STUDIES["default"];

  // Helper: Get Display Name for Discipline
  const getDisciplineDisplayName = (d) => {
    switch (d) {
      case "stage":
        return "Stages";
      case "screen":
        return "Screens";
      case "sound":
        return "Sounds";
      case "experiment":
        return "Explorations";
      default:
        return "Projects";
    }
  };

  // Helper: Get Brand Color for Discipline (Bright variant for Navigation)
  const getBrandColor = (d) => {
    switch (d) {
      case "stage":
        return BRAND_COLORS.stage;
      case "screen":
        return BRAND_COLORS.screens;
      case "sound":
        return BRAND_COLORS.sound;
      case "experiment":
        return BRAND_COLORS.experiments;
      default:
        return BRAND_COLORS.purple;
    }
  };

  // Helper: Get Dark Brand Color for Text/Stats
  const getDarkBrandColor = (d) => {
    switch (d) {
      case "stage":
        return BRAND_COLORS.stageDeep;
      case "screen":
        return BRAND_COLORS.screensDeep;
      case "sound":
        return BRAND_COLORS.soundDeep;
      case "experiment":
        return BRAND_COLORS.experimentsDeep;
      default:
        return BRAND_COLORS.stageDeep;
    }
  };

  const activeColor = getBrandColor(data.discipline);
  const darkColor = getDarkBrandColor(data.discipline);

  // (Old Scroll Detection removed - handled in main effect)

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* HERO SECTION */}
      <header
        className="text-white pt-32 lg:pt-48 pb-16 px-9 md:px-12 lg:px-24 transition-colors duration-700"
        style={{ backgroundColor: data.themeColor || BRAND_COLORS.black }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16">
            <div>
              {/* PRE-HEADER */}
              <SectionPreheader
                text={
                  <>
                    <span className="font-medium opacity-80">
                      {getDisciplineDisplayName(data.discipline)}:
                    </span>{" "}
                    {data.cat}
                  </>
                }
                color="#FFFFFF"
                textColor="#FFFFFF"
                showCircles={false}
              />

              <h1 className="text-6xl md:text-8xl font-extrabold font-outfit tracking-tight leading-[0.9] mb-8">
                {content.titleOverride || data.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/80 font-light max-w-xl leading-relaxed">
                {data.desc}
              </p>
            </div>
            <div className="flex flex-col gap-4 text-sm font-sans text-white/60">
              <div className="pt-2">
                <AnimatedDivider
                  width="100%"
                  className="h-[1px] mb-4 opacity-70"
                  styleContent={{ backgroundColor: activeColor }}
                />
                <div className="grid grid-cols-[1fr_auto_1fr] lg:flex lg:justify-end gap-4 items-center">
                  <span className="text-left">Client</span>
                  <span className="text-white/30">•</span>
                  <span className="text-right text-white">
                    {data.client || "Nive Work"}
                  </span>
                </div>
              </div>
              <div className="pt-2">
                <AnimatedDivider
                  width="100%"
                  className="h-[1px] mb-4 opacity-70"
                  styleContent={{ backgroundColor: activeColor }}
                />
                <div className="grid grid-cols-[1fr_auto_1fr] lg:flex lg:justify-end gap-4 items-center">
                  <span className="text-left">Roles</span>
                  <span className="text-white/30">•</span>
                  <span className="text-right text-white">
                    {data.roles || data.cat}
                  </span>
                </div>
              </div>
              {data.year && (
                <div className="pt-2">
                  <AnimatedDivider
                    width="100%"
                    className="h-[1px] mb-4 opacity-70"
                    styleContent={{ backgroundColor: activeColor }}
                  />
                  <div className="grid grid-cols-[1fr_auto_1fr] lg:flex lg:justify-end gap-4 items-center">
                    <span className="text-left">Years Involved</span>
                    <span className="text-white/30">•</span>
                    <span className="text-right text-white">{data.year}</span>
                  </div>
                </div>
              )}
              {data.team && (
                <div className="pt-2">
                  <AnimatedDivider
                    width="100%"
                    className="h-[1px] mb-4 opacity-70"
                    styleContent={{ backgroundColor: activeColor }}
                  />
                  <div className="grid grid-cols-[1fr_auto_1fr] lg:flex lg:justify-end gap-4 items-center">
                    <span className="text-left">Team</span>
                    <span className="text-white/30">•</span>
                    <span className="text-right text-white">{data.team}</span>
                  </div>
                </div>
              )}
              {data.problem && (
                <div className="pt-2">
                  <AnimatedDivider
                    width="100%"
                    className="h-[1px] mb-4 opacity-70"
                    styleContent={{ backgroundColor: activeColor }}
                  />
                  <div className="grid grid-cols-[1fr_auto_1fr] lg:flex lg:justify-end gap-4 items-center">
                    <span className="text-left">Problem</span>
                    <span className="text-white/30">•</span>
                    <span className="text-right text-white">
                      {data.problem}
                    </span>
                  </div>
                </div>
              )}
              <AnimatedDivider width="100%" className="h-[1px] opacity-70" styleContent={{ backgroundColor: activeColor }} />
            </div>
          </div>

          <div className={`w-full bg-brand-black rounded-theme-md overflow-hidden ${data.heroContain ? '' : 'aspect-[21/9]'}`}>
            <img
              src={data.heroImg || data.img}
              alt="Hero"
              className={`w-full h-full ${data.heroContain ? 'object-contain max-h-[70vh]' : 'object-cover'}`}
            />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT - CENTERED SINGLE COLUMN */}
      <DebugFlexCol
        as="main"
        idPrefix="Main_Section_Gap"
        defaultMobile={82}
        defaultDesktop={117}
        className="max-w-4xl mx-auto px-9 md:px-12 lg:px-24 pt-20 lg:pt-32 pb-16 lg:pb-24 flex flex-col"
      >
        {/* PREFACE (Editor's Note) */}
        {content.preface && (
          <motion.div
            className="bg-gray-50 border-l-4 border-gray-300 p-8 md:p-10 rounded-r-theme-sm"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {content.preface.title && (
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                {content.preface.title}
              </h4>
            )}
            <p
              className="text-lg md:text-xl font-serif italic text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content.preface.body }}
            />
          </motion.div>
        )}

        {/* HERO QUOTE (Alternative to Overview) */}
        {content.heroQuote && (
          <motion.div
            className="py-12 md:py-20 text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-outfit font-light text-brand-ink leading-tight mb-8">
              "{content.heroQuote.text}"
            </h2>
            <div className="flex items-center justify-center gap-4">
              <AnimatedDivider
                width={60}
                className="h-[2px]"
                styleContent={{ backgroundColor: activeColor }}
              />
              <p className="text-sm md:text-base font-sans font-bold tracking-widest uppercase text-brand-ink-muted">
                {content.heroQuote.attribution}
              </p>
              <AnimatedDivider
                width={60}
                className="h-[2px]"
                styleContent={{ backgroundColor: activeColor }}
              />
            </div>
          </motion.div>
        )}

        {/* PROJECT OVERVIEW GRID (Rectangular) */}
        {content.overview && (
          <motion.div
            className="bg-brand-light p-8 md:p-12 rounded-theme-md"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  staggerChildren: 0.1,
                  duration: 0.6,
                  ease: "easeOut",
                },
              },
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              {/* PROBLEM */}
              <motion.div
                className="flex flex-col items-start text-left"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <h3 className="text-xl font-outfit font-extrabold uppercase tracking-wide text-brand-ink leading-none">
                  {content.overview.problemLabel || "Problem"}
                </h3>
                <AnimatedDivider
                  width={40}
                  className="h-[2px] mt-3 mb-4 rounded-full"
                  styleContent={{ backgroundColor: activeColor }}
                />
                <p className="text-brand-ink-body leading-relaxed font-sans">
                  {content.overview.problem}
                </p>
              </motion.div>

              {/* GOAL */}
              <motion.div
                className="flex flex-col items-start text-left"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <h3 className="text-xl font-outfit font-extrabold uppercase tracking-wide text-brand-ink leading-none">
                  Goal
                </h3>
                <AnimatedDivider
                  width={40}
                  className="h-[2px] mt-3 mb-4 rounded-full"
                  styleContent={{ backgroundColor: activeColor }}
                />
                <p className="text-brand-ink-body leading-relaxed font-sans">
                  {content.overview.goal}
                </p>
              </motion.div>

              {/* TEAM */}
              {content.overview.team && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <h3 className="text-xl font-outfit font-extrabold uppercase tracking-wide text-brand-ink">
                    Team
                  </h3>
                  <AnimatedDivider width={40} className="h-[2px] mt-2 mb-4" styleContent={{ backgroundColor: activeColor }} />
                  <p className="text-brand-ink-body leading-relaxed font-sans">
                    {content.overview.team}
                  </p>
                </motion.div>
              )}

              {/* ROLES */}
              {content.overview.roles && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <h3 className="text-xl font-outfit font-extrabold uppercase tracking-wide text-brand-ink">
                    Roles
                  </h3>
                  <AnimatedDivider width={40} className="h-[2px] mt-2 mb-4" styleContent={{ backgroundColor: activeColor }} />
                  <p className="text-brand-ink-body leading-relaxed font-sans">
                    {content.overview.roles}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* HIGHLIGHTS (Hook / Win) - for Solve 24 */}
        {content.highlights && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.3 } },
            }}
          >
            {content.highlights.map((item, index) => {
              const isWin = index === 1;
              return (
                <motion.div
                  key={index}
                  className={`relative flex flex-col gap-8 p-10 md:p-12 rounded-2xl overflow-hidden ${isWin
                    ? "bg-brand-dark text-white shadow-2xl z-10 border border-gray-800"
                    : "bg-gray-50 text-brand-ink shadow-sm border border-gray-100"
                    }`}
                  variants={{
                    hidden: { opacity: 0, x: isWin ? 50 : -50, scale: 0.95 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                      },
                    },
                  }}
                >
                  <h2
                    className={`text-xs md:text-sm font-bold uppercase tracking-widest ${isWin ? "text-brand-blue/90" : "text-brand-ink-body"
                      }`}
                  >
                    {item.label}
                  </h2>
                  <p
                    className={`text-2xl md:text-3xl font-outfit font-medium leading-[1.3] relative z-10 ${isWin ? "text-white" : "text-gray-800"
                      }`}
                  >
                    {item.text}
                  </p>
                  {isWin && (
                    <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full bg-white opacity-20 blur-3xl pointer-events-none"></div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* COMBINED METRICS (Before & After) */}
        {content.combinedMetrics && (
          <motion.div
            className="max-w-6xl mx-auto flex flex-col lg:flex-row rounded-theme-md md:rounded-theme-lg overflow-hidden shadow-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  staggerChildren: 0.1,
                  duration: 0.6,
                  ease: "easeOut",
                },
              },
            }}
          >
            {/* BEFORE */}
            <div className="flex-1 bg-brand-light p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="mb-12 text-center flex flex-col items-center">
                <h3 className="text-sm font-outfit font-bold uppercase tracking-widest text-brand-ink/50 mb-4">
                  {content.combinedMetrics.before.title || "Before"}
                </h3>
                <AnimatedDivider
                  width={60}
                  className="h-[2px] rounded-full"
                  styleContent={{ backgroundColor: activeColor }}
                />
              </div>
              <div className="flex flex-col gap-10">
                {content.combinedMetrics.before.items.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col text-center"
                    variants={{
                      hidden: { opacity: 0, scale: 0.95 },
                      visible: { opacity: 1, scale: 1 },
                    }}
                  >
                    <span className="text-5xl lg:text-6xl font-outfit font-extrabold text-[#04101A] mb-2 tracking-tight">
                      {item.value}
                    </span>
                    <span className="text-sm font-sans font-bold uppercase tracking-wider text-[#04101A] mb-2">
                      {item.label}
                    </span>
                    <span className="text-sm font-sans text-brand-ink-body leading-relaxed max-w-xs mx-auto">
                      {item.desc}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AFTER */}
            <div
              className="flex-1 p-10 md:p-14 relative overflow-hidden"
              style={{ backgroundColor: darkColor }}
            >
              {/* Subtle Glow */}
              <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white opacity-5 blur-3xl pointer-events-none"></div>

              <div className="mb-12 text-center flex flex-col items-center relative z-10">
                <h3 className="text-sm font-outfit font-bold uppercase tracking-widest text-gray-300 mb-4">
                  {content.combinedMetrics.after.title || "After"}
                </h3>
                <AnimatedDivider
                  width={60}
                  className="h-[2px] rounded-full"
                  styleContent={{ backgroundColor: activeColor }}
                />
              </div>
              <div className="flex flex-col gap-10 relative z-10">
                {content.combinedMetrics.after.items.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col text-center"
                    variants={{
                      hidden: { opacity: 0, scale: 0.95 },
                      visible: { opacity: 1, scale: 1 },
                    }}
                  >
                    <span
                      className="text-5xl lg:text-6xl font-outfit font-extrabold mb-2 tracking-tight"
                      style={{ color: activeColor }}
                    >
                      {item.value}
                    </span>
                    <span className="text-sm font-sans font-bold uppercase tracking-wider text-white/90 mb-2">
                      {item.label}
                    </span>
                    <span className="text-sm font-sans text-white/70 leading-relaxed max-w-xs mx-auto">
                      {item.desc}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SECTION 1 */}
        {content.section1 && (
          <SidebarSection
            id="section1"
            data={content.section1}
            activeColor={activeColor}
            themeColor={darkColor}
            projectId={projectId}
            isNavVisible={isNavVisible}
            isHighlight={
              content.section1.preheader?.toLowerCase() === "highlight"
            }
          >
            {content.section1.img && (
              <div className="aspect-video w-full bg-brand-light rounded-theme-sm overflow-hidden mb-8 mt-12">
                <img
                  src={content.section1.img}
                  className="w-full h-full object-cover"
                  alt="Section 1 Visual"
                />
              </div>
            )}
          </SidebarSection>
        )}

        {/* SHOWCASE CAROUSEL (After Introduction) */}
        {content.introShowcase && (
          <ShowcaseCarousel
            images={content.introShowcase.images}
            accentColor={activeColor}
            className="-mx-6 md:-mx-12 lg:-mx-24 py-12 border-y border-brand-dark/10"
          />
        )}

        {/* SECTION 2A */}
        {content.section2A && (
          <SidebarSection
            id="section2A"
            data={content.section2A}
            activeColor={activeColor}
            themeColor={darkColor}
            projectId={projectId}
            isNavVisible={isNavVisible}
            isHighlight={
              content.section2A.preheader?.toLowerCase() === "highlight"
            }
          />
        )}

        {/* SECTION 2 */}
        {content.section2 && (
          <SidebarSection
            id="section2"
            data={content.section2}
            activeColor={activeColor}
            themeColor={darkColor}
            emailShowcase={projectId === "morgan-stanley"}
            projectId={projectId}
            isNavVisible={isNavVisible}
            isHighlight={
              content.section2.preheader?.toLowerCase() === "highlight"
            }
          >
            {/* Legacy Image Rendering for existing case studies */}
            {projectId !== "morgan-stanley" &&
              (content.section2.img1 || content.section2.img2) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  {content.section2.img1 && (
                    <div className="aspect-[3/4] bg-brand-light rounded-theme-sm overflow-hidden">
                      <img
                        src={content.section2.img1}
                        className="w-full h-full object-cover"
                        alt="Detail 1"
                      />
                    </div>
                  )}
                  {content.section2.img2 && (
                    <div className="aspect-[3/4] bg-brand-light rounded-theme-sm overflow-hidden mt-12 md:mt-24">
                      <img
                        src={content.section2.img2}
                        className="w-full h-full object-cover"
                        alt="Detail 2"
                      />
                    </div>
                  )}
                </div>
              )}
          </SidebarSection>
        )}

        {/* SECTION 2B */}
        {content.section2B && (
          <SidebarSection
            id="section2B"
            data={content.section2B}
            activeColor={activeColor}
            themeColor={darkColor}
            projectId={projectId}
            isNavVisible={isNavVisible}
            isHighlight={
              content.section2B.preheader?.toLowerCase() === "highlight"
            }
          />
        )}

        {/* SECTION 2C */}
        {content.section2C && (
          <SidebarSection
            id="section2C"
            data={content.section2C}
            activeColor={activeColor}
            themeColor={darkColor}
            projectId={projectId}
            isNavVisible={isNavVisible}
            isHighlight={
              content.section2C.preheader?.toLowerCase() === "highlight"
            }
          />
        )}

        {/* SECTION 2D */}
        {content.section2D && (
          <SidebarSection
            id="section2D"
            data={content.section2D}
            activeColor={activeColor}
            themeColor={darkColor}
            projectId={projectId}
            isNavVisible={isNavVisible}
            isHighlight={
              content.section2D.preheader?.toLowerCase() === "highlight"
            }
          />
        )}

        {/* INTERSTITIAL QUOTE (Moved after Section 2) */}
        {content.interstitialQuote && (
          <div className="w-full">
            <PullQuote
              content={content.interstitialQuote.content}
              attribution={content.interstitialQuote.attribution}
              className="!my-0"
              color={activeColor}
            />
          </div>
        )}

        {/* SECTION 3 */}
        {content.section3 && (
          <SidebarSection
            id="section3"
            data={content.section3}
            activeColor={activeColor}
            themeColor={darkColor}
            projectId={projectId}
            isNavVisible={isNavVisible}
            isHighlight={
              content.section3.preheader?.toLowerCase() === "highlight"
            }
          >
            {content.section3.img && (
              <div className="aspect-video w-full bg-white rounded-theme-sm overflow-hidden shadow-sm mt-12 mb-8">
                <img
                  src={content.section3.img}
                  className="w-full h-full object-cover"
                  alt="Impact Visual"
                />
              </div>
            )}
          </SidebarSection>
        )}

        {/* SECTION 4 */}
        {content.section4 && (
          <SidebarSection
            id="section4"
            data={content.section4}
            activeColor={activeColor}
            themeColor={darkColor}
            projectId={projectId}
            isNavVisible={isNavVisible}
            isHighlight={
              content.section4.preheader?.toLowerCase() === "highlight"
            }
          >
            {content.section4.img && (
              <div className="aspect-video w-full bg-brand-light rounded-theme-sm overflow-hidden mb-8 mt-12">
                <img
                  src={content.section4.img}
                  className="w-full h-full object-cover"
                  alt="Section 4 Visual"
                />
              </div>
            )}
          </SidebarSection>
        )}

        {/* SECTION 4B (Highlight logic) */}
        {content.section4B && (
          <SidebarSection
            id="section4B"
            data={content.section4B}
            activeColor={activeColor}
            themeColor={darkColor}
            projectId={projectId}
            isNavVisible={isNavVisible}
            isHighlight={
              projectId !== "display-now" && content.section4B.preheader?.toLowerCase() === "highlight"
            }
          />
        )}

        {/* Problem / Solution Major Transition Point (Display Now specific) */}
        {projectId === "display-now" && (
          <>
            <DebugSpacer
              id="ProblemSolution_Top"
              defaultMobile={82}
              defaultDesktop={117}
            />
            <div className="-mx-6 md:-mx-12 lg:-mx-24 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] lg:w-[calc(100%+12rem)] relative z-20">
              <ProblemSolutionTransition color={activeColor} />
            </div>
            <DebugSpacer
              id="ProblemSolution_Bottom"
              defaultMobile={0}
              defaultDesktop={0}
            />
          </>
        )}

        {/* SECTION 5 */}
        {/* Note: In Display Now this gets forced to 0 via layout debugger payload so Mockups are closer */}
        {content.section5 &&
          (content.section5.title ||
            content.section5.body?.length > 0 ||
            content.section5.visualAid) && (
            <SidebarSection
              id="section5"
              data={content.section5}
              activeColor={activeColor}
              themeColor={darkColor}
              projectId={projectId}
              isNavVisible={isNavVisible}
              isHighlight={
                content.section5.preheader?.toLowerCase() === "highlight"
              }
            >
              {content.section5.img && (
                <div className="w-full rounded-xl overflow-hidden mb-8 mt-12 border border-[#EAEAEA] shadow-sm bg-white">
                  <img
                    src={content.section5.img}
                    className="w-full h-auto block"
                    alt="Section 5 Visual"
                  />
                </div>
              )}
            </SidebarSection>
          )}

        {/* SECTION 6 */}
        {content.section6 &&
          (content.section6.title ||
            content.section6.body?.length > 0 ||
            content.section6.visualAid) && (
            <SidebarSection
              id="section6"
              data={content.section6}
              activeColor={activeColor}
              themeColor={darkColor}
              projectId={projectId}
              isNavVisible={isNavVisible}
              isHighlight={
                content.section6.preheader?.toLowerCase() === "highlight"
              }
            >
              {content.section6.img && (
                <div className="aspect-video w-full bg-brand-light rounded-theme-sm overflow-hidden mb-8 mt-12">
                  <img
                    src={content.section6.img}
                    className="w-full h-full object-cover"
                    alt="Section 6 Visual"
                  />
                </div>
              )}
            </SidebarSection>
          )}
      </DebugFlexCol>
    </div>
  );
};

export default CaseStudyTemplate;
