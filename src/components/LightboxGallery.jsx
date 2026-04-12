import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

const LightboxGallery = ({ images = [] }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
                <motion.div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedImage(image)}
                >
                    <img
                        src={image.src}
                        alt={image.alt || `Gallery Image ${index + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                    />
                    {/* Hover Overlay Icon (optional) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                    </div>
                </motion.div>
            ))}

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 md:p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors z-50 p-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <motion.div
                            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-auto overflow-hidden rounded-lg shadow-2xl">
                                <img
                                    src={selectedImage.src}
                                    alt={selectedImage.alt || "Expanded View"}
                                    className="w-full h-full object-contain max-h-[75vh]"
                                />
                            </div>

                            {selectedImage.caption && (
                                <motion.div
                                    className="mt-4 text-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <p className="text-white/90 font-sans text-sm md:text-base font-medium tracking-wide">
                                        {selectedImage.caption}
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LightboxGallery;
