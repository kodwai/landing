import ChallengeNotFoundView from "./ChallengeNotFoundView";

/* Real 404 for unknown or private /challenges/<slug> URLs, inside the same
   public shell so the visitor still has a way forward. */
export default function ChallengeNotFound() {
  return <ChallengeNotFoundView />;
}
