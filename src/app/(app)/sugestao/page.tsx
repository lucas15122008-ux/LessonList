import { FeedbackForm } from "./feedback-form";

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div>
        <h1 className="page-title">Enviar sugestão</h1>
        <p className="mt-1 text-pretty text-stone-600">
          O LessonList está começando e cada ideia ajuda. Conte o que falta, o que atrapalha ou o que você gostaria de ter.
        </p>
      </div>
      <FeedbackForm />
    </div>
  );
}
