import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGmf from "remark-gfm";

import { cn } from "@/lib/utils";

export const markdownClassNames =
  "max-w-none prose prose-neutral dark:prose-invert font-sans";

export function MarkdownRenderer({
  className,
  options,
  ...props
}: MDXRemoteProps & { className?: string }) {
  return (
    <div className={cn(markdownClassNames, className)}>
      <MDXRemote
        {...props}
        options={{
          mdxOptions: {
            remarkPlugins: [
              remarkGmf,
              ...(options?.mdxOptions?.remarkPlugins ?? []),
            ],
          },
        }}
      />
    </div>
  );
}
