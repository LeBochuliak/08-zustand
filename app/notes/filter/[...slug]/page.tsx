import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNotes } from '../../../../lib/api';
import NotesClient from './Notes.client';
import type { Metadata } from 'next';

type NotesByCategoryProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page: number; search: string }>;
};

type NoteDetailsProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: NoteDetailsProps): Promise<Metadata> {
  const { slug } = await params;
  const currentTag = slug[0] === 'all' ? undefined : slug[0];
  const tagOG = slug[0] === 'all' ? 'all' : slug[0];
  return {
    title: `${tagOG} notes`,
    description: `Notes by tag: ${tagOG} `,
    openGraph: {
      title: `${tagOG} notes`,
      description: `Notes by tag: ${tagOG}`,
      url: `https://08-zustand-lenas-projects-10306a6a.vercel.app/notes/filter/${tagOG}`,
      siteName: 'Note Hub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'Note Hub',
        },
      ],
    },
  };
}

export default async function NotesByCategory({
  params,
  searchParams,
}: NotesByCategoryProps) {
  const queryClient = new QueryClient();

  const { slug } = await params;
  const { page, search } = await searchParams;

  const currentTag = slug[0] === 'all' ? undefined : slug[0];

  queryClient.prefetchQuery({
    queryKey: ['notes', page, search, currentTag],
    queryFn: () => fetchNotes({ page, search, currentTag }),
    staleTime: 1000 * 60,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={currentTag} />
    </HydrationBoundary>
  );
}
