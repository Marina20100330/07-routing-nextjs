import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import { type Category, type CategoryNoAll } from "@/types/note";
import { notFound } from "next/navigation";
import type { Metadata } from "next";


    type Props = {
      
      params: Promise<{ slug?: string[] }>; 
    };

    export const dynamicParams = false;
    export const revalidate = 900;

    export async function generateMetadata({ params }: Props): Promise<Metadata> {
      const awaitedParams = await params;
      const { slug = [] } = awaitedParams; 
      const noteForMetadata = slug[0] || "All"; 

      return {
        title: `Notes: ${noteForMetadata}`,
        description: `Notes filtered by ${noteForMetadata}`,
        openGraph: {
          title: `Notes: ${noteForMetadata}`,
          description: `Notes filter: ${noteForMetadata}`,
          url: `https://07-routing-nextjs-five-blond.vercel.app/notes/filter/${noteForMetadata}`,
          siteName: "NoteHub",
          images: [
            {
              url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
              width: 1200,
              height: 630,
              alt: noteForMetadata,
            },
          ],
          type: "article",
        },
      };
    }

    export default async function Page({ params }: Props) {
      const awaitedParams = await params; 
      const { slug = [] } = awaitedParams; 
      const urlTag = slug[0]; 

      if (!urlTag) {
        notFound();
      }

      const tagForApi: CategoryNoAll | undefined =
        urlTag.toLowerCase() === "all" ? undefined : (urlTag as CategoryNoAll);

      const tagForClient: Category = urlTag as Category;

      const qc = new QueryClient();
      await qc.prefetchQuery({
        queryKey: [
          "notes",
          { page: 1, perPage: 8, search: "", tag: tagForApi ?? null },
        ],
        queryFn: () => fetchNotes(1, 8, undefined, tagForApi),
      });

      return (
        <HydrationBoundary state={dehydrate(qc)}>
          <NotesClient category={tagForClient} />
        </HydrationBoundary>
      );
    }
    
