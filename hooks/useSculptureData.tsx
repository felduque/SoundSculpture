import { SculptureService } from "@/services/Sculpture/SculptureService";
import { useSculptureStore } from "@/store/sculpture";
import { useTranslation } from "@/hooks/useTranslation";
import { Sculpture, ShapeType } from "@/types";
import { useEffect, useState } from "react";

interface searchType {
  for: "all" | "id";
  shape: ShapeType;
  text?: string;
}

export const useSculptureData = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  const data = useSculptureStore((state) => state.getAllSculptures());
  const [search, setSearch] = useState<searchType | null>(null);

  useEffect(() => {
    if (data.length === 0 && search === null) {
      refreshSculptures();
    }
  }, []);

  const refreshSculptures = async () => {
    try {
      setLoading(true);
      setError(null);
      const sculp = await SculptureService.getAllSculptures();
      await useSculptureStore.getState().addAllSculptures(sculp);
    } catch (error) {
      setError(t.errors.sculpture.loadFailed);
    } finally {
      setLoading(false);
    }
  };

  const saveSculpture = async (data: Sculpture) => {
    try {
      setLoading(true);
      setError(null);
      await useSculptureStore.getState().addSculpture(data);
      await SculptureService.saveSculpture(data);
    } catch (error) {
      setError(t.errors.sculpture.saveFailed);
    } finally {
      setLoading(false);
    }
  };

  const filteredSculpture = async (searchData: searchType): Promise<void> => {
    try {
      setLoading(true);
      console.log(searchData);
      setSearch(searchData);
      const data = await SculptureService.getFilteredSculptures(searchData);
      await useSculptureStore.getState().addAllSculptures(data);
    } catch (error) {
      setError(t.errors.sculpture.filterFailed);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    setLoading,
    error,
    filteredSculpture,
    refreshSculptures,
    saveSculpture,
  };
};