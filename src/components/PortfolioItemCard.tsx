import { useState } from "react";
import { ExternalLink, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { Button, Chip, Modal } from "@heroui/react";
import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
} from "~/components/ui/panel";
import { useDeletePortfolioItem } from "~/hooks/usePortfolio";
import { useImageUrl } from "~/hooks/useStorage";
import type { PortfolioItem } from "~/db/schema";

const MAX_VISIBLE_TECHNOLOGIES = 5;

interface PortfolioItemCardProps {
  item: PortfolioItem;
  onEdit?: (item: PortfolioItem) => void;
  isOwner?: boolean;
}

export function PortfolioItemCard({
  item,
  onEdit,
  isOwner = false,
}: PortfolioItemCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeletePortfolioItem();
  const { data: imageData } = useImageUrl(item.imageKey || "");
  const imageUrl = imageData?.imageUrl;

  const handleDelete = () => {
    deleteMutation.mutate(
      { data: { id: item.id } },
      {
        onSuccess: () => {
          setDeleteDialogOpen(false);
        },
      }
    );
  };

  return (
    <>
      <Panel className="group overflow-hidden border-border/60 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}

          {/* Overlay actions for owner */}
          {isOwner && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {onEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  onPress={() => onEdit(item)}
                  className="shadow-lg"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                onPress={() => setDeleteDialogOpen(true)}
                className="shadow-lg"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <PanelHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <PanelTitle className="text-lg line-clamp-1">
              {item.title}
            </PanelTitle>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          {item.description && (
            <PanelDescription className="line-clamp-2">
              {item.description}
            </PanelDescription>
          )}
        </PanelHeader>

        {item.technologies && item.technologies.length > 0 && (
          <PanelContent className="pt-0">
            <div className="flex flex-wrap gap-1.5">
              {item.technologies
                .slice(0, MAX_VISIBLE_TECHNOLOGIES)
                .map((tech) => (
                  <Chip key={tech} size="sm" className="text-xs">
                    {tech}
                  </Chip>
                ))}
              {item.technologies.length > MAX_VISIBLE_TECHNOLOGIES && (
                <Chip size="sm" className="text-xs">
                  +{item.technologies.length - MAX_VISIBLE_TECHNOLOGIES}
                </Chip>
              )}
            </div>
          </PanelContent>
        )}
      </Panel>

      {/* Delete confirmation dialog */}
      <Modal>
        <Modal.Backdrop isOpen={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-md">
              <Modal.Header>
                <Modal.Heading>Delete Portfolio Item</Modal.Heading>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete "{item.title}"? This action cannot be undone.
                </p>
              </Modal.Header>
              <Modal.Footer>
                <Button
                  variant="outline"
                  slot="close"
                  isDisabled={deleteMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onPress={handleDelete}
                  isDisabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
