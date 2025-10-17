'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import PortugalHeader from '@/components/PortugalHeader';

interface WordPressPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  link: string;
  categories: number[];
  featured_media: number;
  author: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const ITEMS_PER_PAGE = 12;

export default function DirectoryPage() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/wp-json/wp/v2/posts?per_page=100', {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/wp-json/wp/v2/categories');
      if (!response.ok) return;
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.rendered.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.rendered.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || post.categories.includes(parseInt(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  // Portugal-themed placeholder images
  const getPortugalImage = (postId: number, title: string) => {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes('solar') || lowerTitle.includes('energia solar')) {
      return {
        url: "data:image/svg+xml,%3Csvg viewBox='0 0 400 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%2387CEEB'/%3E%3Ccircle cx='80' cy='40' r='25' fill='%23FFD700'/%3E%3Crect x='150' y='100' width='100' height='60' fill='%232F4F4F' rx='5'/%3E%3Crect x='155' y='105' width='90' height='50' fill='%23191970' rx='3'/%3E%3Cpath d='M20 150 Q200 120 380 160 L380 200 L20 200 Z' fill='%23D2691E' opacity='0.7'/%3E%3Ctext x='30' y='180' font-family='Arial' font-size='12' fill='%238B4513' font-weight='bold'%3EOur Offgrid Journey%3C/text%3E%3C/svg%3E",
        alt: 'Solar panels in Portuguese landscape',
      };
    }

    if (
      lowerTitle.includes('wind') ||
      lowerTitle.includes('eólica') ||
      lowerTitle.includes('turbine')
    ) {
      return {
        url: "data:image/svg+xml,%3Csvg viewBox='0 0 400 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%2398FB98'/%3E%3Cellipse cx='200' cy='180' rx='180' ry='20' fill='%23228B22' opacity='0.8'/%3E%3Cg transform='translate(120,60)'%3E%3Cline x1='0' y1='0' x2='0' y2='100' stroke='%23F5F5DC' stroke-width='8'/%3E%3Ccircle cx='0' cy='0' r='4' fill='%23696969'/%3E%3C/g%3E%3Ctext x='30' y='190' font-family='Arial' font-size='10' fill='%232F4F4F' font-weight='bold'%3EOur Offgrid Journey%3C/text%3E%3C/svg%3E",
        alt: 'Wind turbines in Portuguese countryside',
      };
    }

    if (
      lowerTitle.includes('water') ||
      lowerTitle.includes('água') ||
      lowerTitle.includes('rainwater')
    ) {
      return {
        url: "data:image/svg+xml,%3Csvg viewBox='0 0 400 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%23E0F6FF'/%3E%3Crect x='100' y='80' width='200' height='80' fill='%23D2691E' stroke='%238B4513' stroke-width='2' rx='5'/%3E%3Crect x='110' y='90' width='180' height='60' fill='%234682B4' opacity='0.8' rx='3'/%3E%3Cpath d='M20 160 Q200 140 380 170 L380 200 L20 200 Z' fill='%23228B22' opacity='0.6'/%3E%3Ctext x='30' y='190' font-family='Arial' font-size='10' fill='%232F4F4F' font-weight='bold'%3EOur Offgrid Journey%3C/text%3E%3C/svg%3E",
        alt: 'Water collection system in Portugal',
      };
    }

    if (
      lowerTitle.includes('cabin') ||
      lowerTitle.includes('cabana') ||
      lowerTitle.includes('off-grid')
    ) {
      return {
        url: "data:image/svg+xml,%3Csvg viewBox='0 0 400 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%2398FB98'/%3E%3Cellipse cx='200' cy='180' rx='180' ry='20' fill='%23228B22'/%3E%3Cpolygon points='150,80 250,80 200,40' fill='%23D2691E'/%3E%3Crect x='160' y='80' width='80' height='60' fill='%23DEB887' stroke='%238B4513' stroke-width='2'/%3E%3Crect x='170' y='100' width='20' height='30' fill='%23654321'/%3E%3Crect x='210' y='90' width='20' height='20' fill='%2387CEEB' stroke='%234682B4' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='20' fill='%23FFD700' stroke='%23FFA500' stroke-width='2'/%3E%3Ctext x='30' y='190' font-family='Arial' font-size='10' fill='%232F4F4F' font-weight='bold'%3EOur Offgrid Journey%3C/text%3E%3C/svg%3E",
        alt: 'Off-grid cabin in Portuguese countryside',
      };
    }

    // Default sustainable living image
    return {
      url: "data:image/svg+xml,%3Csvg viewBox='0 0 400 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%2387CEEB'/%3E%3Ccircle cx='100' cy='60' r='30' fill='%23228B22' opacity='0.8'/%3E%3Ccircle cx='300' cy='80' r='25' fill='%2332CD32' opacity='0.8'/%3E%3Ccircle cx='200' cy='100' r='35' fill='%2390EE90' opacity='0.6'/%3E%3Cpath d='M50 150 C150 130, 250 140, 350 160 L350 200 L50 200 Z' fill='%23228B22' opacity='0.7'/%3E%3Ccircle cx='80' cy='40' r='15' fill='%23FFD700'/%3E%3Ctext x='30' y='190' font-family='Arial' font-size='10' fill='%232F4F4F' font-weight='bold'%3EOur Offgrid Journey%3C/text%3E%3C/svg%3E",
      alt: 'Sustainable living in Portugal',
    };
  };

  const togglePostExpansion = (postId: number) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
          <h2 className="mb-2 text-2xl font-bold text-destructive">Error Loading Content</h2>
          <p className="mb-4 text-muted-foreground">{error}</p>
          <Button onClick={fetchPosts} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="renewable-gradient portugal-pattern min-h-screen">
      <PortugalHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-primary" />
            <Input
              data-testid="search-input"
              placeholder="Pesquisar artigos... • Search articles..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="border-primary/20 pl-10 focus:border-primary focus:ring-primary/20"
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={(value: string) => {
              setSelectedCategory(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger data-testid="category-filter" className="w-full md:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias • All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="mb-2 h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : paginatedPosts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              {searchQuery || selectedCategory !== 'all'
                ? 'No posts match your search criteria'
                : 'No posts available'}
            </p>
          </div>
        ) : (
          <>
            <div
              className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              data-testid="posts-grid"
            >
              {paginatedPosts.map((post) => {
                const isExpanded = expandedPosts.has(post.id);
                return (
                  <Card
                    key={post.id}
                    data-testid={`post-card-${post.id}`}
                    className="tile-hover flex flex-col overflow-hidden border-l-4 border-l-primary/30"
                  >
                    {/* Portugal-themed image header */}
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={getPortugalImage(post.id, post.title.rendered).url}
                        alt={getPortugalImage(post.id, post.title.rendered).alt}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    <CardHeader className="pb-3">
                      <div className="mb-2">
                        <CardTitle className="text-lg leading-tight">
                          {stripHtml(post.title.rendered)}
                        </CardTitle>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(post.date).toLocaleDateString('pt-PT', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pt-0">
                      <div
                        className={`text-sm text-muted-foreground ${isExpanded ? '' : 'line-clamp-3'}`}
                      >
                        {isExpanded ? (
                          <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
                        ) : (
                          <p>{stripHtml(post.excerpt.rendered)}</p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-3">
                      <Button
                        className="w-full bg-gradient-to-r from-primary to-accent font-medium text-white hover:from-primary/90 hover:to-accent/90"
                        onClick={() => togglePostExpansion(post.id)}
                      >
                        {isExpanded ? (
                          <>
                            <svg
                              className="mr-2 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                            Mostrar Menos • Show Less
                          </>
                        ) : (
                          <>
                            <svg
                              className="mr-2 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                            Ler Mais • Read More
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2" data-testid="pagination">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  data-testid="prev-page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-4 text-sm text-muted-foreground" data-testid="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  data-testid="next-page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
