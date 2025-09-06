import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGmf from "remark-gfm";

import { markdownClassNames } from "./_MarkdownEditor";
import { cn } from "@/lib/utils";

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
