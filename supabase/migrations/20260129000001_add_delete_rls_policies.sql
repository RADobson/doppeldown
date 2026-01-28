-- Add DELETE policies for threats, scans, and reports
-- These tables have SELECT/INSERT/UPDATE policies but no DELETE policies

CREATE POLICY "Users can delete threats for own brands" ON public.threats
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.brands
            WHERE brands.id = threats.brand_id
            AND brands.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete scans for own brands" ON public.scans
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.brands
            WHERE brands.id = scans.brand_id
            AND brands.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete reports for own brands" ON public.reports
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.brands
            WHERE brands.id = reports.brand_id
            AND brands.user_id = auth.uid()
        )
    );
