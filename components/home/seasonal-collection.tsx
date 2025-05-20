"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SeasonalCollectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  direction?: "left" | "right";
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function SeasonalCollection({
  title = "Summer Collection 2025",
  subtitle = "Limited Edition",
  description = "Our new summer collection is here! Discover the perfect audio companions for your beach days and outdoor adventures.",
  imageUrl = "/images/seasonal/summer-collection.jpg",
  direction = "left",
  buttonText = "Explore Collection",
  buttonLink = "/collections/summer",
  backgroundColor = "bg-blue-50 dark:bg-blue-900/20",
  textColor = "text-blue-900 dark:text-blue-100",
}: SeasonalCollectionProps) {
  const [collectionData, setCollectionData] =
    useState<SeasonalCollectionProps | null>(null);
  const [fetchError, setFetchError] = useState(false);

  // Fetch featured collection if available
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    // If we already encountered an error, use default values and don't try again
    if (fetchError) {
      setCollectionData({
        title,
        subtitle,
        description,
        imageUrl,
        direction,
        buttonText,
        buttonLink,
        backgroundColor,
        textColor,
      });
      return;
    }

    const fetchSeasonalCollection = async () => {
      try {
        // Fetch from API endpoint with a timeout to prevent hanging requests
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(
          "/api/admin/featured-collections?active=true",
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!isMounted) return;

        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const collection = data[0];
            setCollectionData({
              title: collection.title,
              subtitle: collection.subtitle || "Featured Collection",
              description: collection.description,
              imageUrl:
                collection.imageUrl || "/images/seasonal/summer-collection.jpg",
              buttonText: "Shop Collection",
              buttonLink: `/collections/${collection.slug}`,
              backgroundColor,
              textColor,
              direction,
            });
            return;
          }
        }

        // Use default props if no API data or response not OK
        setCollectionData({
          title,
          subtitle,
          description,
          imageUrl,
          direction,
          buttonText,
          buttonLink,
          backgroundColor,
          textColor,
        });
      } catch (error) {
        console.error("Error fetching seasonal collection:", error);
        setFetchError(true);

        // Use default props as fallback
        if (isMounted) {
          setCollectionData({
            title,
            subtitle,
            description,
            imageUrl,
            direction,
            buttonText,
            buttonLink,
            backgroundColor,
            textColor,
          });
        }
      }
    };

    fetchSeasonalCollection();

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [
    title,
    subtitle,
    description,
    imageUrl,
    direction,
    buttonText,
    buttonLink,
    backgroundColor,
    textColor,
    fetchError,
  ]);

  if (!collectionData) {
    return null;
  }

  const isImageLeft = collectionData.direction === "left";

  return (
    <section className={`py-16 ${collectionData.backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Image Section */}
          <div
            className={`md:w-1/2 order-2 ${
              isImageLeft ? "md:order-1" : "md:order-2"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, x: isImageLeft ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={collectionData.imageUrl}
                alt={collectionData.title}
                className="rounded-lg shadow-lg w-full h-auto object-cover aspect-[4/3]"
              />
            </motion.div>
          </div>

          {/* Text Section */}
          <div
            className={`md:w-1/2 ${collectionData.textColor} order-1 ${
              isImageLeft ? "md:order-2" : "md:order-1"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-sm font-medium uppercase tracking-wider">
                {collectionData.subtitle}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                {collectionData.title}
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-lg">
                {collectionData.description}
              </p>
              <Button asChild size="lg">
                <Link href={collectionData.buttonLink || "#"}>
                  {collectionData.buttonText}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
