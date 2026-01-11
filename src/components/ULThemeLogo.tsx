import { cn } from "@/lib/utils";
import { extractTokenValue } from "@/utils/helpers/tokenUtils";

export interface ULThemeLogoProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Optional image url of the logo.
   */
  imageUrl?: string;
  /**
   * Alt Text for the logo image
   */
  altText: string;
  /**
   * Optional Classes for custom overrides
   */
  className?: string;
}

const ULThemeLogo = ({
  imageUrl,
  altText,
  className,
  ...rest
}: ULThemeLogoProps) => {
  // Using extractTokenValue utility to extract the logo URL, Logo Visible flags from CSS variable
  const themedLogoSrcValue = extractTokenValue("--ul-theme-widget-logo-url");
  const isLogoHidden =
    extractTokenValue("--ul-theme-widget-logo-position") === "none";
  const themedStylesContainer = "flex flex-wrap justify-widget-logo";
  const themedStylesImg =
    "h-(--height-widget-logo) w-auto object-contain object-center";
  const logoSrc = themedLogoSrcValue || imageUrl;

  return (
    !isLogoHidden && (
      <div className={cn(themedStylesContainer, className)}>
        <img
          src={logoSrc}
          alt={altText}
          className={cn(themedStylesImg)}
          loading="eager" // Default should load an image immediately
          decoding="async" // Decode the image asynchronously
          fetchPriority="high" // Fetch the image at a high priority
          {...rest}
        />
      </div>
    )
  );
};
export default ULThemeLogo;
