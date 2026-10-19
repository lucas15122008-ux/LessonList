import { FeedbackForm } from "./feedback-form";

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold">Enviar sugestão</h1>
        <p className="text-stone-600">
          O LessonList está começando e cada ideia ajuda. Conte o que falta, o que atrapalha ou o que você gostaria de ter.
        </p>
      </div>
      <FeedbackForm />
    </div>
  );
}
