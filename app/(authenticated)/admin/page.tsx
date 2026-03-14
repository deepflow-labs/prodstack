"use client";

import { useMutation, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminPage() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.admin.listUsers,
    {},
    { initialNumItems: 25 }
  );
  const banUser = useMutation(api.admin.banUser);
  const unbanUser = useMutation(api.admin.unbanUser);
  const toggleAdmin = useMutation(api.admin.toggleAdmin);

  const [search, setSearch] = useState("");
  const [banTarget, setBanTarget] = useState<Id<"users"> | null>(null);
  const [banReason, setBanReason] = useState("");

  const filtered = results.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()));

  const handleBan = async () => {
    if (!banTarget || !banReason.trim()) return;
    try {
      await banUser({ userId: banTarget, reason: banReason.trim() });
      toast.success("User banned");
      setBanTarget(null);
      setBanReason("");
    } catch {
      toast.error("Failed to ban user");
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">Users</h1>

      <Input
        placeholder="Search by email…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 max-w-sm"
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.name ?? "—"}</TableCell>
                <TableCell className="font-mono text-sm">{user.email ?? "—"}</TableCell>
                <TableCell>
                  {user.isAdmin ? (
                    <Badge variant="default">Admin</Badge>
                  ) : (
                    <Badge variant="secondary">User</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.isBanned ? (
                    <Badge variant="destructive">Banned</Badge>
                  ) : (
                    <Badge variant="outline">Active</Badge>
                  )}
                </TableCell>
                <TableCell className="space-x-2">
                  {user.isBanned ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        try {
                          await unbanUser({ userId: user._id });
                          toast.success("User unbanned");
                        } catch {
                          toast.error("Failed to unban user");
                        }
                      }}
                    >
                      Unban
                    </Button>
                  ) : (
                    <Button size="sm" variant="destructive" onClick={() => setBanTarget(user._id)}>
                      Ban
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      try {
                        await toggleAdmin({ userId: user._id });
                        toast.success("Admin status updated");
                      } catch (e: unknown) {
                        const message = e instanceof Error ? e.message : "Failed";
                        toast.error(message);
                      }
                    }}
                  >
                    {user.isAdmin ? "Remove admin" : "Make admin"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {status === "CanLoadMore" && (
        <Button variant="outline" className="mt-4" onClick={() => loadMore(25)}>
          Load more
        </Button>
      )}

      {/* Ban dialog */}
      <Dialog open={!!banTarget} onOpenChange={() => setBanTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban user</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Reason for ban…"
            value={banReason}
            onChange={e => setBanReason(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleBan()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBan} disabled={!banReason.trim()}>
              Confirm ban
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
