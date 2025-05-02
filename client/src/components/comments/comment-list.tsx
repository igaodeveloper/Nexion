import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Comment, CommentReaction, CustomReaction, User } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  MoreHorizontal,
  X,
  CheckCircle,
  Reply,
  Smile,
  Edit,
  Flag,
  Copy,
  Send,
  Plus,
  Heart,
  ThumbsUp,
  Loader2,
  AlertTriangle,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { EmojiPicker } from "@/components/comments/emoji-picker";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface CommentListProps {
  documentId: number;
}

// Extend User type to include avatar
interface ExtendedUser extends User {
  avatar?: string;
}

export function CommentList({ documentId }: CommentListProps) {
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments for the document
  const {
    data: comments,
    isLoading: commentsLoading,
    refetch,
  } = useQuery<Comment[]>({
    queryKey: ["/api/documents", documentId, "comments"],
  });

  // Fetch reactions for comments
  const { data: reactions } = useQuery<CommentReaction[]>({
    queryKey: ["/api/documents", documentId, "reactions"],
    enabled: !!comments && comments.length > 0,
  });

  // Fetch custom reactions for the organization
  const { data: customReactions } = useQuery<CustomReaction[]>({
    queryKey: ["/api/reactions/custom"],
  });

  // Fetch users
  const { data: users } = useQuery<ExtendedUser[]>({
    queryKey: ["/api/users"],
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (newComment: {
      text: string;
      documentId: number;
      parentId?: number;
    }) => {
      setIsSubmitting(true);
      const response = await apiRequest("POST", "/api/comments", newComment);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/documents", documentId, "comments"],
      });
      setCommentText("");
      setReplyToId(null);
      setIsSubmitting(false);
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  // Toggle reaction mutation
  const toggleReactionMutation = useMutation({
    mutationFn: async ({
      commentId,
      emoji,
    }: {
      commentId: number;
      emoji: string;
    }) => {
      const response = await apiRequest("POST", "/api/comments/reactions", {
        commentId,
        emoji,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/documents", documentId, "reactions"],
      });
    },
  });

  // Resolve comment mutation
  const resolveCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await apiRequest(
        "PATCH",
        `/api/comments/${commentId}/resolve`,
      );
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/documents", documentId, "comments"],
      });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await apiRequest("DELETE", `/api/comments/${commentId}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/documents", documentId, "comments"],
      });
    },
  });

  const handleSubmitComment = () => {
    if (!commentText.trim() || isSubmitting) return;

    const newComment = {
      text: commentText,
      documentId,
      parentId: replyToId || undefined,
    };

    addCommentMutation.mutate(newComment);
  };

  const handleReactionClick = (commentId: number, emoji: string) => {
    toggleReactionMutation.mutate({ commentId, emoji });
    setShowEmojiPicker(null);
  };

  const getUser = (userId: number) => {
    return users?.find((user) => user.id === userId);
  };

  const getCommentReplies = (commentId: number) => {
    return comments?.filter((comment) => comment.parentId === commentId) || [];
  };

  const getCommentReactions = (commentId: number) => {
    return (
      reactions?.filter((reaction) => reaction.commentId === commentId) || []
    );
  };

  const getUserInitials = (user?: ExtendedUser) => {
    if (!user) return "?";
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`;
  };

  // Group reactions by emoji
  const getGroupedReactions = (commentId: number) => {
    const commentReactions = getCommentReactions(commentId);
    return commentReactions.reduce(
      (acc, reaction) => {
        if (!acc[reaction.emoji]) {
          acc[reaction.emoji] = [];
        }
        acc[reaction.emoji].push(reaction);
        return acc;
      },
      {} as Record<string, CommentReaction[]>,
    );
  };

  // Quick reactions
  const quickReactions = ["👍", "❤️", "😄", "🎉", "👀"];

  // Build a tree of comments (top-level comments and their replies)
  const topLevelComments =
    comments?.filter((comment) => !comment.parentId) || [];

  const renderComment = (comment: Comment, isReply = false) => {
    const user = getUser(comment.createdBy);
    const replies = getCommentReplies(comment.id);
    const groupedReactions = getGroupedReactions(comment.id);

    return (
      <div
        key={comment.id}
        className={cn(
          "mb-4 last:mb-0",
          isReply
            ? "ml-8 mt-2"
            : "border-t border-border pt-4 first:border-t-0 first:pt-0",
        )}
      >
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 border shadow-sm">
            <AvatarImage src={user?.avatar || ""} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
                {comment.resolved && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-green-50 text-green-700 border-green-200 flex items-center"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Resolvido
                  </Badge>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-muted rounded-full"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {!comment.resolved && (
                    <DropdownMenuItem
                      onClick={() => resolveCommentMutation.mutate(comment.id)}
                      className="cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Resolver</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => setReplyToId(comment.id)}
                    className="cursor-pointer"
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    <span>Responder</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Copy className="h-4 w-4 mr-2" />
                    <span>Copiar texto</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <Edit className="h-4 w-4 mr-2" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Flag className="h-4 w-4 mr-2" />
                    <span>Reportar</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-1 text-sm whitespace-pre-wrap">
              {comment.text}
            </div>

            {/* Reactions */}
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(groupedReactions).map(([emoji, reactions]) => (
                <TooltipProvider key={emoji}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="flex items-center rounded-full bg-muted/60 px-2 py-0.5 text-xs hover:bg-muted transition-colors"
                        onClick={() => handleReactionClick(comment.id, emoji)}
                      >
                        <span className="mr-1">{emoji}</span>
                        <span>{reactions.length}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs font-medium pb-1">Reações</div>
                      {reactions.map((r) => {
                        const reactUser = getUser(r.userId);
                        return (
                          <div key={r.id} className="text-xs py-0.5">
                            {reactUser?.firstName} {reactUser?.lastName}
                          </div>
                        );
                      })}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 rounded-full"
                  onClick={() => setShowEmojiPicker(comment.id)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  <Smile className="h-3 w-3" />
                </Button>

                {showEmojiPicker === comment.id && (
                  <EmojiPicker
                    onSelect={(emoji: string) =>
                      handleReactionClick(comment.id, emoji)
                    }
                    onClose={() => setShowEmojiPicker(null)}
                    customReactions={customReactions}
                  />
                )}
              </div>
            </div>

            {/* Quick reactions */}
            {!isReply && (
              <div className="flex flex-wrap gap-1 mt-1">
                {quickReactions.map((emoji) => (
                  <button
                    key={emoji}
                    className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted/60 transition-colors"
                    onClick={() => handleReactionClick(comment.id, emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Replies */}
            {replies.length > 0 && (
              <div className="mt-2">
                {replies.map((reply) => renderComment(reply, true))}
              </div>
            )}

            {/* Reply form */}
            {replyToId === comment.id && (
              <div className="mt-3 flex gap-3">
                <Avatar className="h-8 w-8 border shadow-sm">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    ME
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Escreva uma resposta..."
                    className="resize-none min-h-[60px] focus-visible:ring-1"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReplyToId(null)}
                      className="h-8"
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim() || isSubmitting}
                      className="h-8 gap-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Enviando</span>
                        </>
                      ) : (
                        <>
                          <Reply className="h-3 w-3" />
                          <span>Responder</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-sm text-primary">Discussão</h3>
          {comments && comments.length > 0 && (
            <Badge
              variant="outline"
              className="text-xs rounded-full h-5 px-1.5 bg-primary/5 hover:bg-primary/5"
            >
              {comments.length}
            </Badge>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1"
          onClick={() => refetch()}
        >
          <RefreshCw className="h-3 w-3" />
          <span className="text-xs">Atualizar</span>
        </Button>
      </div>

      <Separator />

      {/* New comment input */}
      {!replyToId && (
        <div className="flex gap-3 pt-1">
          <Avatar className="h-8 w-8 border shadow-sm">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary">
              ME
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Adicione um comentário ou menção (@)"
              className="resize-none min-h-[80px] focus-visible:ring-1"
              rows={3}
            />
            <div className="flex justify-between mt-2">
              <div className="flex gap-1">
                {/* Emoji button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                      >
                        <Smile className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Adicionar emoji
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Mention button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                      >
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Mencionar alguém
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Button
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || isSubmitting}
                size="sm"
                className="gap-1 h-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Enviando</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3" />
                    <span>Comentar</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Comments list */}
      {commentsLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : topLevelComments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
          <MessageCircle className="h-12 w-12 mb-2 text-muted-foreground/30" />
          <p>Não há comentários ainda</p>
          <p className="text-sm mt-1">
            Seja o primeiro a iniciar uma discussão
          </p>
        </div>
      ) : (
        <div className="space-y-2 mt-4">
          {topLevelComments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
}
