import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink } from 'lucide-react';

const AnimeDialog = ({ dialogOpen, setDialogOpen, selectedAnime, handleAddToList }) => {
  // Helper function to format field display
  const formatField = (value) => value || 'Not Available';

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-xl bg-gray-800 rounded-xl border-2 border-purple-800">
            <div className="flex flex-col max-h-[85vh]">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {selectedAnime?.title}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-2 mt-4 px-1">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-purple-400">Type</div>
                  <div className="text-gray-400">{selectedAnime?.type || 'Unknown'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-purple-400">Status</div>
                  <div className="text-gray-400">{selectedAnime?.status || 'Unknown'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-purple-400">Season</div>
                  <div className="text-gray-400 capitalize">{selectedAnime?.season || 'Unknown'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-purple-400">Broadcast</div>
                  <div className="text-gray-400">{selectedAnime?.broadcast || 'Unknown'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-purple-400">Popularity</div>
                  <div className="text-gray-400">{selectedAnime?.popularity || 'Unknown'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-purple-400">Episodes</div>
                  <div className="text-gray-400">{selectedAnime?.episodes || 'Unknown'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-purple-400">Duration</div>
                  <div className="text-gray-400">{selectedAnime?.duration || 'Unknown'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-purple-400">Score</div>
                  <div className="text-gray-400">{selectedAnime?.score ? `${selectedAnime.score}/10` : 'Not rated'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-purple-400">Rating</div>
                  <div className="text-gray-400">{selectedAnime?.rating || 'Unknown'}</div>
                </div>
              </div>

              <ScrollArea className="flex-1 mt-6 pr-4">
                <div className="space-y-4">
                  {selectedAnime?.image && (
                    <img
                      src={selectedAnime.image}
                      alt={selectedAnime.title}
                      className="w-full h-64 object-cover rounded-lg border border-purple-800"
                    />
                  )}
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Synopsis:</h4>
                    <p className="text-sm text-gray-400">{selectedAnime?.synopsis || 'No synopsis available.'}</p>
                  </div>

                  {selectedAnime?.genres?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Genres:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnime.genres.map((genre, index) => (
                          <Badge 
                            key={index}
                            className="bg-purple-900/50 text-purple-400 border border-purple-800"
                          >
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAnime?.demographics?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Demographics:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnime.demographics.map((demo, index) => (
                          <Badge 
                            key={index}
                            className="bg-purple-900/50 text-purple-400 border border-purple-800"
                          >
                            {demo}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAnime?.studios?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Studios:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnime.studios.map((studio, index) => (
                          <Badge 
                            key={index}
                            className="bg-purple-900/50 text-purple-400 border border-purple-800"
                          >
                            {studio}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAnime?.aired && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Air Dates:</h4>
                      <p className="text-sm text-purple-400">
                        {selectedAnime.aired.from && new Date(selectedAnime.aired.from).toLocaleDateString()}
                        {selectedAnime.aired.to && ` - ${new Date(selectedAnime.aired.to).toLocaleDateString()}`}
                      </p>
                    </div>
                  )}

                  {selectedAnime?.trailer && (
                    <Button 
                      variant="outline" 
                      className="w-full border-purple-800 hover:bg-purple-900/50"
                      onClick={() => window.open(selectedAnime.trailer, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Watch Trailer
                    </Button>
                  )}

                  {selectedAnime?.inList && (
                    <div className="p-2 bg-purple-900/30 rounded-lg">
                      <p className="text-sm text-purple-400">
                        Status: {selectedAnime.userStatus || 'Plan to Watch'}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <DialogFooter className="flex gap-2 mt-4 border-t border-purple-800 pt-4">
                {!selectedAnime?.inList && (
                  <Button 
                    onClick={() => {
                      handleAddToList(selectedAnime);
                      setDialogOpen(false);
                    }}
                    className="bg-purple-800 hover:bg-purple-700 border border-purple-600"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add to List
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => setDialogOpen(false)} 
                  className="border-purple-800 hover:bg-gray-700"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      );
};

export default AnimeDialog;