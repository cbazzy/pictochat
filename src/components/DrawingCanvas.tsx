"use client";

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface DrawingCanvasRef {
    clear: () => void;
    getDataURL: () => string | null;
    isEmpty: () => boolean;
}

interface DrawingCanvasProps {
    className?: string;
    onDrawStart?: () => void;
    onDrawEnd?: () => void;
}

export const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(({ className, onDrawStart, onDrawEnd }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const hasDrawnRef = useRef(false);

    useImperativeHandle(ref, () => ({
        clear: () => {
            const canvas = canvasRef.current;
            const context = contextRef.current;
            if (canvas && context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                hasDrawnRef.current = false;
            }
        },
        getDataURL: () => {
            if (!canvasRef.current || !hasDrawnRef.current) return null;
            // We return standard data URL
            return canvasRef.current.toDataURL("image/png");
        },
        isEmpty: () => !hasDrawnRef.current
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Handle resizing if needed, but for now fixed init
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        canvas.style.width = `${canvas.offsetWidth}px`;
        canvas.style.height = `${canvas.offsetHeight}px`;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 2;
        contextRef.current = context;
        context.imageSmoothingEnabled = false;

    }, []);

    const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
        // Prevent default touch actions (scrolling)
        // event.preventDefault(); // React synthetic events might not need this or it might be too aggressive

        const { offsetX, offsetY } = getCoordinates(event);
        contextRef.current?.beginPath();
        contextRef.current?.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        onDrawStart?.();
        hasDrawnRef.current = true;
    };

    const finishDrawing = () => {
        contextRef.current?.closePath();
        setIsDrawing(false);
        onDrawEnd?.();
    };

    const draw = (event: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCoordinates(event);
        contextRef.current?.lineTo(offsetX, offsetY);
        contextRef.current?.stroke();
    };

    const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
        let clientX, clientY;

        if ('touches' in event) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = (event as React.MouseEvent).clientX;
            clientY = (event as React.MouseEvent).clientY;
        }

        const canvas = canvasRef.current;
        if (!canvas) return { offsetX: 0, offsetY: 0 };
        const rect = canvas.getBoundingClientRect();

        return {
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top
        };
    }

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            onMouseLeave={finishDrawing}
            onTouchStart={startDrawing}
            onTouchEnd={finishDrawing}
            onTouchMove={draw}
            className={cn("bg-white touch-none cursor-crosshair", className)}
        />
    );
});

DrawingCanvas.displayName = "DrawingCanvas";
