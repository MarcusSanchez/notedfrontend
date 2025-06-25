import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"

type AuthCardProps = {
  title: string | ReactNode;
  description: string | ReactNode;
  content?: ReactNode;
  footer: ReactNode;
  outsideContent?: ReactNode;
};

export function AuthCard({ title, description, content, footer, outsideContent }: AuthCardProps) {
  return (
    <div className="min-h-[88vh] flex flex-col justify-center items-center gap-2">
      <Card className="w-full max-w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {content && <CardContent>{content}</CardContent>}
        <CardFooter>{footer}</CardFooter>
      </Card>
      {outsideContent}
    </div>
  )
}