import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44, Review, Business, User } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Plus, 
  Building2, 
  Filter,
  CheckCircle,
  X
} from "lucide-react";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [starFilter, setStarFilter] = useState<number | "all">("all");
  const [user, setUser] = useState<User | null>(null);

  // New review modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBizId, setSelectedBizId] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const rList = await base44.reviews.list();
    setReviews(rList);
    const bList = await base44.businesses.list();
    setBusinesses(bList);
    if (bList.length > 0 && !selectedBizId) {
      setSelectedBizId(bList[0].id);
    }
    const currentUser = await base44.auth.me();
    setUser(currentUser);
    if (currentUser) {
      setAuthorName(currentUser.full_name);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !selectedBizId) return;

    const targetBiz = businesses.find((b) => b.id === selectedBizId);

    const created = await base44.reviews.create({
      business_id: selectedBizId,
      business_name: targetBiz ? targetBiz.name : "Negócio Local",
      user_name: authorName || "Cliente",
      rating,
      comment,
    });

    setReviews([created, ...reviews]);
    setIsModalOpen(false);
    setComment("");
  };

  const handleToggleLike = (reviewId: string) => {
    setLikedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const filtered = reviews.filter((r) => {
    if (starFilter === "all") return true;
    return r.rating === starFilter;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            Voz da Comunidade & Avaliações
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Experiências reais e opiniões verificadas de clientes dos comércios locais
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Avaliar um Estabelecimento
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setStarFilter("all")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            starFilter === "all" ? "bg-blue-900 text-white" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          Todas as Avaliações ({reviews.length})
        </button>
        {[5, 4, 3].map((star) => (
          <button
            key={star}
            onClick={() => setStarFilter(star)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              starFilter === star ? "bg-blue-900 text-white" : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            <span>{star} Estrelas</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filtered.map((rev) => {
          const isLiked = likedReviews[rev.id];
          const displayLikes = rev.likes + (isLiked ? 1 : 0);

          return (
            <div
              key={rev.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{rev.user_name}</span>
                    <span className="text-[10px] text-slate-400">· {rev.created_at}</span>
                  </div>

                  <Link
                    to={createPageUrl("BusinessDetail", { id: rev.business_id })}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 hover:underline"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {rev.business_name}
                  </Link>
                </div>

                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                "{rev.comment}"
              </p>

              <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => handleToggleLike(rev.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    isLiked
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Útil ({displayLikes})</span>
                </button>

                <span className="text-[11px] text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Visita verificada
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Deixar Avaliação</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estabelecimento</label>
                <select
                  value={selectedBizId}
                  onChange={(e) => setSelectedBizId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Seu Nome</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nota (1 a 5 estrelas)</label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-semibold text-slate-800 ml-2">{rating} de 5</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Seu Comentário</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Conte o que achou do atendimento, agilidade ou produto..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm">
                  Publicar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
