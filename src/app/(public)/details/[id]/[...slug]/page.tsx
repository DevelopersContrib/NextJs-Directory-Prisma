"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Details from "../../components/Details";

const Page = () => {
  const router = useRouter();
  const { id } = router.query;

  const [linkDetails, setLinkDetails] = useState(null);

  useEffect(() => {
    if (router.isReady && id) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/links/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await response.json();
          setLinkDetails(data);
        } catch (error) {
          console.error("Error fetching link details:", error);
        }
      };
      fetchData();
    }
  }, [router.isReady, id]);

  if (!router.isReady || !linkDetails) {
    return <p>Loading...</p>;  // Ensure we check both router readiness and data availability
  }

  return (
    <main>
      <Details />  {/* Pass the linkDetails as props */}
    </main>
  );
};

export default Page;
