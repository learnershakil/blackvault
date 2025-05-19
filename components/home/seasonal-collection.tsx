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
  title = "Summer Collection 2023",
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

  // Fetch featured collection if available
  useEffect(() => {
    const fetchSeasonalCollection = async () => {
      try {
        // You could fetch from an API endpoint that returns seasonal collection data
        const response = await fetch(
          "/api/admin/featured-collections?active=true&seasonal=true"
        );

        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const collection = data[0];
            setCollectionData({
              title: collection.title,
              subtitle: collection.subtitle || "Featured Collection",
              description: collection.description,
              imageUrl: collection.imageUrl,
              buttonText: "Shop Collection",
              buttonLink: `/collections/${collection.slug}`,
              backgroundColor,
              textColor,
            });
            return;
          }
        }

        // Use default props if no API data found
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
        // Use default props as fallback
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
    };

    fetchSeasonalCollection();
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
          <motion.div
            className={`md:w-1/2 order-2 ${
              isImageLeft ? "md:order-1" : "md:order-2"
            }`}
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

          {/* Text Section */}
          <motion.div
            className={`md:w-1/2 ${collectionData.textColor} order-1 ${
              isImageLeft ? "md:order-2" : "md:order-1"
            }`}
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
    </section>
  );
}
