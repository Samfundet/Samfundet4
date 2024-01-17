import { Link, useLocation } from 'react-router-dom';

export function Breadcrumb() {
  const location = useLocation();
  const { pathname } = location;
  const segments = pathname.split('/').filter(Boolean);
  const baseUrl = 'http://localhost:3000';

  let url = '';
  const breadcrumbLinks = segments.map((segment, i) => {
    url += '/' + segment;
    if (i != segments.length - 1) {
      segment += ' > ';
    }
    return (
      <Link key={i} to={baseUrl + url}>
        {segment}
      </Link>
    );
  });

  const baseLink = <Link to={baseUrl + url}>{'Hjem > '}</Link>;
  const result = [];
  result.push(baseLink);
  result.push(breadcrumbLinks);
  return <div className="breadcrumb">{result}</div>;
}
