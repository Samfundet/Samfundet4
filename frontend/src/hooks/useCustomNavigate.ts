import { useNavigate } from 'react-router';
import type { LinkTarget } from '~/Components/Link/Link';
import { BACKEND_DOMAIN } from '~/constants';
import { useGlobalContext } from '~/context/GlobalContextProvider';

export type CustomNavigateProps = {
  isMetaDown?: boolean;
  event?: React.MouseEvent;
  url: string | number;
  linkTarget?: LinkTarget;
  replace?: boolean;
};

export type CustomNavigateFn = (props: CustomNavigateProps, direction?: number) => void;

/**
 * Custom navigation hook to correctly navigate in different environments.
 * This is the function our <Link> component uses.
 */
export function useCustomNavigate(): CustomNavigateFn {
  const navigate = useNavigate();
  const { setIsMobileNavigation } = useGlobalContext();

  function handleClick({ event, isMetaDown, url, replace = false, linkTarget = 'frontend' }: CustomNavigateProps) {
    const finalUrl = linkTarget === 'backend' ? BACKEND_DOMAIN + url : url;
    // Stop default <a> tag onClick handling. We want custom behaviour depending on the target.
    event?.preventDefault();

    // Even though nested <a> tags are illegal, they might occur.
    // To prevent multiple link clicks on overlaying elements, stop propagation upwards.
    event?.stopPropagation();

    // Close mobile menu if originates from there.
    setIsMobileNavigation(false);

    /** Detected desire to open the link in a new tab.
     * True if ctrl or cmd click.
     */
    const isCmdClick = isMetaDown || (event && (event.ctrlKey || event.metaKey));
    // React navigation.
    if (linkTarget === 'frontend' && !isCmdClick) {
      navigate(typeof url === 'number' ? url : finalUrl, { replace });
    }
    // Normal change of href to trigger reload.
    else if (linkTarget === 'backend' && !isCmdClick) window.location.href = finalUrl;
    else if (linkTarget === 'samf3' && !isCmdClick) window.location.href = finalUrl;
    else if (linkTarget === 'email') window.location.href = finalUrl;
    // Open in new tab.
    else window.open(finalUrl, '_blank');
  }

  return handleClick;
}
