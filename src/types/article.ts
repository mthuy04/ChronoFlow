export interface RelatedArticle {
    slug: string;
    title: string;
  }
  
  export interface Article {
    slug: string;
    title: string;
    category: string;
    read: string;
    color: string;
    intro: string;
    body: string[];
    related: RelatedArticle[];
  }