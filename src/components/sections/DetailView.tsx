/**
 * Barrel & réexportation rétro-compatible des vues détaillées modulaires :
 *  - ServiceDetailView : fiche détaillée enrichie d'un service (01 à 04)
 *  - SolutionDetailView : fiche détaillée d'une solution sectorielle
 *  - BlogDetailView : fiche détaillée d'un article ou rapport technique
 *  - DetailNotFound : encart fallback partagé
 */

export { DetailNotFound } from "./detail/DetailNotFound";
export type { DetailNotFoundProps } from "./detail/DetailNotFound";

export { ServiceDetailView } from "./detail/ServiceDetailView";
export type { ServiceDetailViewProps } from "./detail/ServiceDetailView";

export { SolutionDetailView } from "./detail/SolutionDetailView";
export type { SolutionDetailViewProps } from "./detail/SolutionDetailView";

export { BlogDetailView } from "./detail/BlogDetailView";
export type { BlogDetailViewProps } from "./detail/BlogDetailView";
